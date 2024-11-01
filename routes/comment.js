// routes/comment.js
const express = require("express");
const router = express.Router();
const Comment = require("../models/comment");
const Controller = require("../controller/comment");

// Get comments for a specific task
router.get('/comment/:id',Controller.getCommentsByTask);

// Add a comment to a task
router.post("/", async (req, res) => {
  try {
    const { taskId, comment } = req.body;
    const newComment = new Comment({ comment, task: taskId });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Fetch comments for a specific task
router.get("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.find({ task: taskId });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

module.exports = router;
