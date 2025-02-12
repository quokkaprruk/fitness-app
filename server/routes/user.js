const express = require("express");
const jwt = require("jsonwebtoken");
<<<<<<< HEAD
const User = require("../models/member_profiles");
=======
const User = require("../models/all_users"); // change to all_users
>>>>>>> d91dfa20f0c75a68c0eca259ce3009ffb5b67a14
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");
const logger = require("../middleware/logger");
const { hashPassword, comparePassword } = require("../middleware/auth");

require("dotenv").config();

// User login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "5m" } // Token Expiry
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
    return res.status(400).json({ message: "Email, username, and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already in use" });
    }    

    const profileId = uuidv4();

    const newUser = new User({
      email,
      username,
      password,
      profileId, 
      role: "member", 
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      username: newUser.username,
      role: newUser.role,
      profileId: newUser.profileId,
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;