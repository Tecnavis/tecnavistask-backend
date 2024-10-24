var express = require('express');
var router = express.Router();
const Controller = require('../controller/task')
//routes for task

router.post('/', Controller.createTask);
router.get('/', Controller.getAllTasks);
router.get('/:id', Controller.getTask);
router.put('/:id', Controller.updateTask);
router.delete('/:id', Controller.deleteTask);
router.delete('/', Controller.deleteAllTasks);


module.exports = router;
