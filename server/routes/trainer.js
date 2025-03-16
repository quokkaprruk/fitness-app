const express = require("express");
const Trainer = require("../models/trainer_profiles");
const logger = require("../middleware/logger"); // use logger
const router = express.Router();

// GET: Fetch all trainers
router.get("/", async (req, res) => {
  try {
    const trainers = await Trainer.find();
    if (trainers.length > 0) {
      logger.info(Successfully found ${trainers.length} trainer(s).);
      res.status(200).json(trainers);
    } else {
      logger.info("No trainers found");
      res.status(200).json([]);
    }
  } catch (error) {
    logger.error(Error fetching trainers: ${error.message});
    res.status(500).json({ message: error.message });
  }
});

// POST: Create a new trainer
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, email, specialization, experience } = req.body;

    if (!firstName || !lastName || !email || !specialization || !experience) {
      return res.status(400).json({ message: "All fields are required" });
    }

    console.log("Incoming Trainer Data >>>", req.body);

    const newTrainer = new Trainer({
      profileId: email, // Use email as a unique identifier
      firstName,
      lastName,
      email,
      specialty: typeof specialization === 'string' ? specialization.split(",").map(item => item.trim()) : [],
      experience: Number(experience),
    });

    await newTrainer.save();
    logger.info(Trainer ${firstName} ${lastName} created successfully.);
    res.status(201).json({ message: "Trainer created successfully", trainer: newTrainer });
  } catch (error) {
     console.error("FULL ERROR >>>", error);
    logger.error(Error creating trainer: ${error.message});
    res.status(500).json({ message: "Error creating trainer", error: error.message });
  }
});

module.exports = router; 