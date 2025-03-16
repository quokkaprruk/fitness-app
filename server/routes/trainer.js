const express = require("express");
const Trainer = require("../models/trainer_profiles");
const logger = require("../middleware/logger"); // use logger
const router = express.Router();
const fs = require("fs");
const path = require("path");

const jsonFilePath = path.join(__dirname, "../data/trainers.json");

// Ensure the JSON file exists with base structure
if (!fs.existsSync(jsonFilePath)) {
  fs.writeFileSync(jsonFilePath, JSON.stringify({ trainers: [] }, null, 2));
}

// GET: Fetch all trainers
router.get("/", (req, res) => {
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ message: "Error reading trainers file" });
    }

    const trainersData = JSON.parse(data);
    res.status(200).json(trainersData.trainers || []);
  });
});

// POST: Create a new trainer
router.post("/", (req, res) => {
  const { firstName, lastName, email, specialization, experience } = req.body;

  if (!firstName || !lastName || !email || !specialization || !experience) {
    return res.status(400).json({ message: "All fields are required" });
  }

  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ message: "Error reading trainers file" });
    }

    const trainersData = JSON.parse(data);
    const trainers = trainersData.trainers || [];

    const newTrainer = {
      instructorID: trainers.length + 1,
      name: `${firstName} ${lastName}`,
      specialty: specialization.split(",").map(item => item.trim()),
      teachingMode: ["online", "on-site"], // Hardcoded or dynamic if needed
      contact: email,
      experience: Number(experience)
    };

    if (isNaN(newTrainer.experience)) {
        return res.status(400).json({ message: "Experience must be a number" });
      }

   trainers.push(newTrainer);

      fs.writeFile(jsonFilePath, JSON.stringify({ trainers }, null, 2), (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return res.status(500).json({ message: "Error saving trainer" });
        }

        res.status(201).json({ message: "Trainer created successfully", trainer: newTrainer });
      });
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr);
      res.status(500).json({ message: "Invalid JSON format in trainers file" });
    }
  });
});

module.exports = router;