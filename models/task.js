const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    tasks: [
        {
            task: { type: String, required: true },
            description: { type: String },
            image: { type: String }
        }
    ],
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    priority: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    endDate: { type: Date },
    taskId: { type: String, required: true }
});

module.exports = mongoose.model("Task", taskSchema);
