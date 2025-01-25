const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/profile");
const router = express.Router();
require("dotenv").config();

// User login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "10s" } // Token expires in 1 hour
    );

    res.json({
      message: "Login successful",
      token,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// User sign up route
router.post("/signup", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Email, username, and password are required" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already in use" });
    }

    const newUser = new User({
      email,
      username,
      password,
      role: "user",
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      username: newUser.username,
      role: newUser.role,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
