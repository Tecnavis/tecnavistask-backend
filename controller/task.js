const Model = require('../models/task');
const asyncHandler = require("express-async-handler");


exports.createTask = asyncHandler(async (req, res) => {
  const { email, task, project, priority, status, date, name, endDate } = req.body;
  
  try {
    const tasks = await Model.create({ 
      email, 
      task, 
      project, 
      priority, 
      name,  
      status, 
      date, 
      endDate 
    });
  
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task" });
  }
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

// Update task status to 'Complete'
exports.updateTaskStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTask = await Model.findByIdAndUpdate(
        id,
        { status: "Complete" },
        { new: true }
      );
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Error updating task status", error });
    }
  };


  exports.addDescriptionToTask = async (req, res) => {
    try {
        const { taskId, newDescription } = req.body;

        // Find the task and update the description array
        const task = await Model.findByIdAndUpdate(
            taskId,
            { $push: { description: newDescription } },
            { new: true } // Return the updated document
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("Error adding description:", error);
        res.status(500).json({ message: "Error adding description", error });
    }
};