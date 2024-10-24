const mongoose = require("mongoose");
const admins = require("./admins");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    staffId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    staff: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, required: true },
    title:{type: String, required: true},
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}); 

module.exports = mongoose.model("Task", taskSchema)