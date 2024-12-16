var express = require('express');
var router = express.Router();
const Controller = require('../controller/attendance')  

router.post("/check-in", Controller.checkIn);
router.post("/check-out", Controller.checkOut);
router.post("/apply-leave", Controller.applyLeave);
router.get("/:employeeId", Controller.getEmployeeAttendance);
router.get("/status/:employeeId",Controller.getAttendanceStatus);


module.exports = router;