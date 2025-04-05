const express = require("express");
const router = express.Router();
const CommunityPost = require("../models/community_post");

const { authenticateToken } = require("../middleware/auth");
const { checkAdminRole } = require("../middleware/roleAuth");

// GET /api/community - Retrieve all community posts (public)
router.get("/", async (req, res) => {
  try {
    const posts = await CommunityPost.find({}).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching community posts",
      error: error.message,
    });
  }
});

// POST /api/community - Create a new community post (admin-only)
router.post("/", authenticateToken, checkAdminRole, async (req, res) => {
  try {
    const { userId, title, content } = req.body;
    if (!userId || !title || !content) {
      return res
        .status(400)
        .json({ message: "userId, title, and content are required" });
    }
    const newPost = new CommunityPost({ userId, title, content });
    const savedPost = await newPost.save();
    res
      .status(201)
      .json({ message: "Community post created", post: savedPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating community post", error: error.message });
  }
});

// PUT /api/community/:id - Update an existing community post (admin-only)
router.put("/:id", authenticateToken, checkAdminRole, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedPost = await CommunityPost.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ message: "Community post not found" });
    }
    res
      .status(200)
      .json({ message: "Community post updated", post: updatedPost });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating community post", error: error.message });
  }
});

// DELETE /api/community/:id - Delete a community post (admin-only)
router.delete("/:id", authenticateToken, checkAdminRole, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await CommunityPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: "Community post not found" });
    }

    res.status(200).json({
      message: "Community post deleted successfully",
      deletedPost,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting community post", error: error.message });
  }
});

module.exports = router;
