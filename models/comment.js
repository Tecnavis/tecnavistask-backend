const mongoose = require("mongoose");
const task = require("./task");

const commentSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    task: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema)