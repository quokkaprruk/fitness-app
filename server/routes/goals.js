const express = require("express");
const router = express.Router();
const logger = require("../middleware/logger");
const MemberTodo = require("../models/member_todo");
const MemberProfiles = require("../models/member_profiles");

// GET /api/users/goals
// Get all goals
router.get("/", async (req, res) => {
  try {
    const { profileId } = req.user;

    // Find member profile to get the todoId
    const memberProfile = await MemberProfiles.findOne({ profileId });
    if (!memberProfile) {
      logger.warn(`Member profile not found for profileId: ${profileId}`);
      return res.status(404).json({ message: "Member profile not found" });
    }

    const todoId = memberProfile.todoPlan[0]; // Get the first todoPlan ID
    if (!todoId) {
      logger.warn(`No todo plan found for member profileId: ${profileId}`);
      return res.status(404).json({ message: "Todo plan not found" });
    }

    // Get goals with optional filtering
    const { type } = req.query; // type can be 'current', 'achieved', or undefined for all
    const goals = await MemberTodo.findById(todoId);

    if (!goals) {
      logger.error(`Todo document not found for todoId: ${todoId}`);
      return res.status(404).json({ message: "Goals not found" });
    }

    let response = {};
    if (!type || type === "current") {
      response.currentGoals = goals.currentGoals.sort(
        (a, b) => b.createdAt - a.createdAt,
      );
    }
    if (!type || type === "achieved") {
      response.achievedGoals = goals.achievedGoals.sort(
        (a, b) => b.achievedAt - a.achievedAt,
      );
    }

    logger.info(`Successfully retrieved goals for member ${profileId}`);
    res.status(200).json(response);
  } catch (error) {
    logger.error(`Error retrieving goals: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error retrieving goals", error: error.message });
  }
});

// POST /api/users/goals
// Add a new goal
router.post("/", async (req, res) => {
  try {
    const { profileId } = req.user;
    const { text } = req.body;
    logger.info(profileId);
    logger.info(text);

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      logger.warn(`Invalid goal text provided by user ${profileId}`);
      return res.status(400).json({ message: "Valid goal text is required" });
    }

    const memberProfile = await MemberProfiles.findOne({ profileId });
    if (!memberProfile) {
      logger.warn(`Member profile not found for profileId: ${profileId}`);
      return res.status(404).json({ message: "Member profile not found" });
    }

    const todoId = memberProfile.todoPlan[0];
    if (!todoId) {
      logger.warn(`No todo plan found for member profileId: ${profileId}`);
      return res.status(404).json({ message: "Todo plan not found" });
    }

    const newGoal = {
      text: text.trim(),
      createdAt: new Date(),
    };

    const updatedTodo = await MemberTodo.findByIdAndUpdate(
      todoId,
      { $push: { currentGoals: newGoal } },
      { new: true },
    );

    logger.info(`New goal added for member ${profileId}`);
    res.status(201).json({
      message: "Goal added successfully",
      goal: newGoal,
    });
  } catch (error) {
    logger.error(`Error adding new goal: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error adding goal", error: error.message });
  }
});

// PUT /api/users/goals/achieve
// Mark a goal as achieved
router.put("/achieve", async (req, res) => {
  try {
    const { profileId } = req.user;
    const { goalId } = req.body;

    if (!goalId) {
      logger.warn(`No goalId provided by user ${profileId}`);
      return res.status(400).json({ message: "Goal ID is required" });
    }

    const memberProfile = await MemberProfiles.findOne({ profileId });
    if (!memberProfile) {
      logger.warn(`Member profile not found for profileId: ${profileId}`);
      return res.status(404).json({ message: "Member profile not found" });
    }

    const todoId = memberProfile.todoPlan[0];
    const todo = await MemberTodo.findById(todoId);
    if (!todo) {
      logger.warn(`Todo not found for todoId: ${todoId}`);
      return res.status(404).json({ message: "Todo not found" });
    }

    // Find the goal in currentGoals
    const goalIndex = todo.currentGoals.findIndex(
      (goal) => goal._id.toString() === goalId,
    );

    if (goalIndex === -1) {
      logger.warn(`Goal ${goalId} not found in current goals`);
      return res
        .status(404)
        .json({ message: "Goal not found in current goals" });
    }

    // Move goal to achievedGoals
    const achievedGoal = {
      ...todo.currentGoals[goalIndex].toObject(),
      achievedAt: new Date(),
    };

    todo.currentGoals.splice(goalIndex, 1);
    todo.achievedGoals.push(achievedGoal);
    await todo.save();

    logger.info(`Goal ${goalId} marked as achieved for member ${profileId}`);
    res.status(200).json({
      message: "Goal marked as achieved",
      achievedGoal,
    });
  } catch (error) {
    logger.error(`Error achieving goal: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error achieving goal", error: error.message });
  }
});

// PUT /api/users/goals/revert
// Revert an achieved goal back to current
router.put("/revert", async (req, res) => {
  try {
    const { profileId } = req.user;
    const { goalId } = req.body;

    if (!goalId) {
      logger.warn(`No goalId provided by user ${profileId}`);
      return res.status(400).json({ message: "Goal ID is required" });
    }

    const memberProfile = await MemberProfiles.findOne({ profileId });
    if (!memberProfile) {
      logger.warn(`Member profile not found for profileId: ${profileId}`);
      return res.status(404).json({ message: "Member profile not found" });
    }

    const todoId = memberProfile.todoPlan[0];
    const todo = await MemberTodo.findById(todoId);
    if (!todo) {
      logger.warn(`Todo not found for todoId: ${todoId}`);
      return res.status(404).json({ message: "Todo not found" });
    }

    // Find the goal in achievedGoals
    const goalIndex = todo.achievedGoals.findIndex(
      (goal) => goal._id.toString() === goalId,
    );

    if (goalIndex === -1) {
      logger.warn(`Goal ${goalId} not found in achieved goals`);
      return res
        .status(404)
        .json({ message: "Goal not found in achieved goals" });
    }

    // Move goal back to currentGoals
    const revertedGoal = {
      text: todo.achievedGoals[goalIndex].text,
      createdAt: todo.achievedGoals[goalIndex].createdAt,
    };

    todo.achievedGoals.splice(goalIndex, 1);
    todo.currentGoals.push(revertedGoal);
    await todo.save();

    logger.info(`Goal ${goalId} reverted to current for member ${profileId}`);
    res.status(200).json({
      message: "Goal reverted to current",
      revertedGoal,
    });
  } catch (error) {
    logger.error(`Error reverting goal: ${error.message}`);
    res
      .status(500)
      .json({ message: "Error reverting goal", error: error.message });
  }
});

module.exports = router;
