const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    project: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Project", projectSchema)