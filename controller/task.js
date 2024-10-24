const Model = require('../models/task');
const asyncHandler = require("express-async-handler");


exports.createTask = asyncHandler(async (req, res) => {
    const { email, description, project, priority, title, status, date, name, endDate } = req.body;
    const task = await Model.create({ 
      email, 
      description, 
      project, 
      priority, 
      name,  
      title, 
      status, 
      date, 
      endDate 
    });
  
    res.status(200).json(task);
  });
  

// Get all tasks
exports.getAllTasks = asyncHandler(async (req, res) => {
    const tasks = await Model.find();
    res.status(200).json(tasks);
})

// Get single task
exports.getTask = asyncHandler(async (req, res) => {
    const task = await Model.findById(req.params.id);
    res.status(200).json(task); 
})

// Update task
exports.updateTask = asyncHandler(async (req, res) => {
    const { staff, email, description, project, priority, title, status, date, endDate } = req.body;
    const task = await Model.findByIdAndUpdate(req.params.id, { staff, email, description, project, priority, title, status, date, endDate }, {
        new: true
    });
    res.status(200).json(task);
})

// Delete task
exports.deleteTask = asyncHandler(async (req, res) => {
    const task = await Model.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "Task deleted"});
})

// Delete all tasks 
exports.deleteAllTasks = asyncHandler(async (req, res) => {
    const task = await Model.deleteMany();
    res.status(200).json(task);
})