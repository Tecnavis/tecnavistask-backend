var express = require('express');
var router = express.Router();
const Controller = require('../controller/task')
const Admin = require('../models/admins')
//routes for task

router.post('/', Controller.createTask);
router.get('/', Controller.getAllTasks);
router.get('/:id', Controller.getTask);
router.put('/:id', Controller.updateTask);
router.delete('/:id', Controller.deleteTask);
router.delete('/', Controller.deleteAllTasks);
router.get('/admins', async (req, res) => {
    try {
      const admins = await Admin.find({}, 'name email'); 
      res.json(admins);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching admins' });
    }
  });
module.exports = router;
