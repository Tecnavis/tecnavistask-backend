
const Comment = require("../models/comment");


exports.getCommentsByTask = async (req, res) => {
    const { id } = req.params;
    try {
        const comments = await Comment.find({ task: id }).sort({ createdAt: 1 });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};
