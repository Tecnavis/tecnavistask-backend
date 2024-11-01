var express = require('express');
var router = express.Router();
const Controller = require('../controller/task')
const Admin = require('../models/admins')
//routes for task
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.post('/',upload.array("images"), Controller.createTask);
router.get("/project/:projectId", Controller.getTasksByProjectId);

router.get('/', Controller.getAllTasks);
router.get('/:id', Controller.getTask);
router.put('/:id', Controller.updateTask);
router.delete('/:id', Controller.deleteTask);
router.delete('/', Controller.deleteAllTasks);
router.post("/add-description",Controller.addDescriptionToTask);
router.put("/:id/complete", Controller.updateTaskStatus);
router.get('/admins', async (req, res) => {
    try {
      const admins = await Admin.find({}, 'name email'); 
      res.json(admins);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching admins' });
    }
  });
module.exports = router;
