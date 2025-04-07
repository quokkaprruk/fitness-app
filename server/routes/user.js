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
const MemberTodo = require("../models/member_todo");
const MemberSubscriptionPlan = require("../models/member_subscription");
const mongoose = require("mongoose");
const { notify } = require("../utils/notify");
const { checkUserOwnership } = require("../middleware/roleAuth");
const goalsRoutes = require("./goals");
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

    let profile = null;
    if (user.role === "trainer") {
      profile = await TrainerProfiles.findOne({ profileId: user.profileId });
    }
    const profileObjectId = profile ? profile._id : null;
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        profileId: user.profileId,
        profileObjectId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Token Expiry
    );

    res.json({
      message: "Login successful. Redirecting to login page.",
      token,
      username: user.username,
      role: user.role,
      profileObjectId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to get required fields from a model's schema
function getRequiredFields(model) {
  const requiredFields = [];
  const schema = model.schema;

  Object.keys(schema.paths).forEach((path) => {
    if (schema.paths[path].isRequired) {
      // Exclude profileId since it's auto-generated
      if (path !== "profileId") {
        requiredFields.push(path);
      }
    }
  });

  return requiredFields;
}

// User sign up route
router.post("/signup", async (req, res) => {
  const { email, username, password, role = "member" } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();

  // Basic validation
  if (!email || !username || !password) {
    return res.status(400).json({
      message: "Email, username, and password are required",
    });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long",
    });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        message: "Email or username already in use",
      });
    }

    const profileId = uuidv4();
    const newUser = new User({
      email,
      username,
      password,
      profileId,
      role: role,
    });

    // Get the appropriate profile model based on role
    let ProfileModel;
    switch (role) {
      case "admin":
        ProfileModel = AdminProfiles;
        break;
      case "trainer":
        ProfileModel = TrainerProfiles;
        break;
      case "member":
        ProfileModel = MemberProfiles;
        break;
      default:
        throw new Error("Invalid role specified");
    }

    // Get required fields for the profile type
    const requiredFields = getRequiredFields(ProfileModel);

    // Validate all required fields are present
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      throw new Error(
        `Missing required fields for ${role} profile: ${missingFields.join(
          ", "
        )}`
      );
    }

    // Create profile with all fields from request body
    const profileData = {
      profileId,
      ...req.body,
    };
    const newProfile = new ProfileModel(profileData);

    // Save user and profile
    await newUser.save({ session });
    await newProfile.save({ session });

    if (role === "member") {
      const newTodo = new MemberTodo({
        memberProfileObjectId: newProfile._id,
        goal: "Set your first goal!",
      });
      await newTodo.save({ session });

      newProfile.todoPlan.push(newTodo._id);
      await newProfile.save({ session });
    }

    const freeSubscription = new MemberSubscriptionPlan({
      memberProfileObjectId: newProfile._id,
      planType: "free",
      price: 0,
      startDate: new Date(),
      endDate: null,
      subscriptionStatus: "active",
    });

    await freeSubscription.save({ session });
    newProfile.subscriptionPlan = freeSubscription._id;

    await newProfile.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "User registered successfully",
      username: newUser.username,
      role: newUser.role,
      profileId: newUser.profileId,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.message.includes("Missing required fields")) {
      return res.status(400).json({ message: error.message });
    }

    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Find the user by ID from token
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = newPassword; // Password is already being hashed when you save.

    await user.save();

    res.json({
      message:
        "Password successfully reset. Please log in with your new password.",
    });
  } catch (error) {
    logger.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found." });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const emailSent = await notify(
      email,
      "Password Reset Request",
      `Click the link below to reset your password:\n\n${resetLink}\n\nThis link will expire in 15 minutes.`
    );

    if (emailSent) {
      res.json({ message: "Reset link sent! Check your email." });
    } else {
      res.status(500).json({ message: "Error sending reset link." });
    }
  } catch (error) {
    logger.error("Error sending reset email:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Siripa: GET profile by all_users's profileId
router.get("/profile/:profileId", checkUserOwnership, async (req, res) => {
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
router.post("/profile/:profileId", checkUserOwnership, async (req, res) => {
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

router.post("/verify-email", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.use("/goals", checkUserOwnership, goalsRoutes);

module.exports = router;
