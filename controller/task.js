const Model = require('../models/task');
const asyncHandler = require("express-async-handler");
// Get all tasks
exports.getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Model.find().populate('project'); // Ensure this is correct
  res.status(200).json(tasks);
});


// Modify getTasksByProjectId to sort tasks by priority or date
exports.getTasksByProjectId = async (req, res) => {
  const { projectId } = req.params;

  try {
      const tasks = await Model.find({ project: projectId })
          .populate("staff")
          .populate("project")
          .sort({ priority: 1, date: 1 }); // Sort by priority (ascending) and then by date (ascending)

      if (!tasks || tasks.length === 0) {
          return res.status(404).json({ message: "No tasks found for this project." });
      }

      res.status(200).json(tasks);
  } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "An error occurred while fetching tasks." });
  }
};


const generateTaskId = async (count) => {
  const lastTask = await Model.findOne().sort({ _id: -1 }).select("taskId");
  const baseId = lastTask && lastTask.taskId ? parseInt(lastTask.taskId.substring(2), 10) : 1000;
  
  // Generate `count` number of unique task IDs
  const taskIds = Array.from({ length: count }, (_, i) => `TS${baseId + i + 1}`);
  return taskIds;
};

exports.createTask = asyncHandler(async (req, res) => {
  const { email, tasks, project, priority, status, date, name, endDate } = req.body;

  try {
    const taskIds = await generateTaskId(tasks.length); // Generate task IDs for each sub-task

    const taskDocuments = tasks.map((taskContent, index) => ({
      email,
      task: taskContent,
      project,
      priority,
      name,
      status,
      date,
      endDate,
      taskId: taskIds[index] // Assign each generated taskId
    }));

    const newTasks = await Model.insertMany(taskDocuments);
    res.status(200).json(newTasks); 
  } catch (error) {
    console.error("Error creating tasks:", error);
    res.status(500).json({ message: "Error creating tasks" });
  }
});



// Get single task
exports.getTask = asyncHandler(async (req, res) => {
    const task = await Model.findById(req.params.id);
    res.status(200).json(task); 
})

// Update task
exports.updateTask = asyncHandler(async (req, res) => {
    const { staff, email, task, project, priority, status, date, endDate } = req.body;
    const tasks = await Model.findByIdAndUpdate(req.params.id, { staff, email, task, project, priority, status, date, endDate }, {
        new: true
    });
    res.status(200).json(tasks);
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
            { $push: { task: newDescription } },
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