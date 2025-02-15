//For all_users
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/all_users"); // change to all_users
const AdminProfiles = require("../models/admin_profiles");
const MemberProfiles = require("../models/member_profiles");
const TrainerProfiles = require("../models/trainer_profiles");
const router = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");
const logger = require("../middleware/logger");
const { hashPassword, comparePassword } = require("../middleware/auth");
const AllUsers = require("../models/all_users");

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
    return res
      .status(400)
      .json({ message: "Email, username, and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already in use" });
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

// GET profile by all_users's profileId
router.get("/profile/:profileId", async (req, res) => {
  const { profileId } = req.params;

  if (!profileId) {
    logger.warn("Missing profileId in GET request.");
    return res.status(400).json({ message: "profileId is required." });
  }

  try {
    logger.debug(`Checking user existence with profileId: ${profileId}`);

    const user = await AllUsers.findOne({ profileId });

    if (!user) {
      logger.warn(`User not found with profileId: ${profileId}`);
      return res.status(404).json({ message: "User not found." });
    }

    const { role } = user; // Extract role from the user
    logger.info(`User found: ${user.username} (${role})`);

    let profile;
    switch (role) {
      case "admin":
        profile = await AdminProfiles.findOne({ profileId });
        break;
      case "member":
        profile = await MemberProfiles.findOne({ profileId });
        break;
      case "trainer":
        profile = await TrainerProfiles.findOne({ profileId });
        break;
      default:
        logger.warn(
          `Invalid role found in database for profileId: ${profileId}`
        );
        return res.status(400).json({ message: "Invalid role in database." });
    }

    if (!profile) {
      logger.warn(
        `Profile not found for profileId: ${profileId} (Role: ${role})`
      );
      return res.status(404).json({ message: "Profile not found." });
    }

    logger.info(`Profile found for ${role} with profileId: ${profileId}`);
    logger.debug(`Profile details: ${JSON.stringify(profile)}`);

    res.status(200).json({ user, profile });
  } catch (err) {
    logger.error(
      `Error fetching profile for profileId: ${profileId} - ${err.message}`
    );
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

//Siripa
//POST to save profile using all_users's profileId
router.post("/profile/:profileId", async (req, res) => {
  const { profileId } = req.params;
  const updatedProfileData = req.body; //get the submitted profileData from req.body

  if (!profileId) {
    logger.warn("Missing profileId in POST request.");
    return res.status(400).json({ message: "profileId is required." });
  }

  try {
    const user = await AllUsers.findOne({ profileId });
    if (!user) {
      logger.warn(`User not found with profileId: ${profileId}`);
      return res.status(404).json({ message: "User not found." });
    }

    const { role } = user;
    logger.info(`User found: ${user.username} (Role: ${role})`);

    // find the schema that we need to update the profileId
    let profileModel;
    switch (role) {
      case "admin":
        profileModel = AdminProfiles;
        break;
      case "member":
        profileModel = MemberProfiles;
        break;
      case "trainer":
        profileModel = TrainerProfiles;
        break;
      default:
        logger.warn(`Invalid role in database for profileId: ${profileId}`);
        return res.status(400).json({ message: "Invalid role in database." });
    }

    logger.debug(`Updating profile for profileId: ${profileId}`);

    const updatedProfile = await profileModel.findOneAndUpdate(
      { profileId },
      { $set: updatedProfileData }, // modify only the provided fields
      { new: true, runValidators: true } // Return updated document & apply validation
    );

    if (!updatedProfile) {
      logger.warn(`Profile not found for profileId: ${profileId}
        => signup login didn't properly setup user's profile. If the profileId is in the all_users, it should be in the profiles schema as well`);
      return res.status(404).json({ message: "Profile not found." });
    }

    logger.info(`Profile updated successfully for profileId: ${profileId}`);
    logger.debug(`Updated Profile: ${JSON.stringify(updatedProfile)}`);

    res.status(200).json({
      message: "Profile updated successfully.",
      profile: updatedProfile,
    });
  } catch (err) {
    logger.error(
      `Error updating profile for profileId: ${profileId} - ${err.message}`
    );
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
module.exports = router;
