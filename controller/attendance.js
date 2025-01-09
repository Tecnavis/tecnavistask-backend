const Attendance = require("../models/attendance");

exports.checkIn = async (req, res) => {
    const { employeeId } = req.body;
    try {
        const attendance = await Attendance.findOneAndUpdate(
            { employee: employeeId, date: { $gte: new Date().setHours(0, 0, 0, 0) } },
            {
                $push: { records: { status: true, checkinTime: new Date() } },
            },
            { new: true, upsert: true }
        );
        res.json({ success: true, message: "Checked in successfully", attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: "Check-in failed", error });
    }
};

exports.checkOut = async (req, res) => {
    const { employeeId } = req.body;
    try {
        const attendance = await Attendance.findOneAndUpdate(
            {
                employee: employeeId,
                date: { $gte: new Date().setHours(0, 0, 0, 0) },
                "records.status": true, // Find a record where status is checkedIn
            },
            {
                $set: {
                    "records.$.status": false,
                    "records.$.checkoutTime": new Date(),
                },
            },
            { new: true }
        );
        if (!attendance) {
            return res.status(404).json({ success: false, message: "Check-in required before check-out" });
        }
        res.json({ success: true, message: "Checked out successfully", attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: "Check-out failed", error });
    }
};



// Get attendance history of an employee
exports.getEmployeeAttendance = async (req, res) => {
    const { employeeId } = req.params;

    try {
        const attendanceRecords = await Attendance.find({ employee: employeeId }).sort({ date: -1 });

        if (!attendanceRecords) {
            return res.status(404).json({ success: false, message: "No attendance records found" });
        }

        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.applyLeave = async (req, res) => {
    try {
        const { employeeId, leaveType } = req.body;

        if (!employeeId || !leaveType) {
            return res.status(400).json({ message: "Missing employeeId or leaveType" });
        }

        // Fetch attendance for the given employee
        let attendance = await Attendance.findOne({ employee: employeeId });

        if (!attendance) {
            // Create a new attendance record if not found
            attendance = new Attendance({
                employee: employeeId,
                leave: leaveType,
            });

            // Adjust leave balance if required
            if (leaveType === "Monthly Permitted Leave") {
                attendance.remainingLeaves.monthlyPermitted -= 1;
            } else if (leaveType === "Sick Leave") {
                attendance.remainingLeaves.sickLeave -= 1;
            }

            await attendance.save();
            return res.status(201).json({ message: "New attendance record created with leave applied", attendance });
        }

        // Handle the leave logic
        if (leaveType === "Loss of Pay Leave") {
            // Loss of Pay leave does not affect remainingLeaves
        } else if (leaveType === "Monthly Permitted Leave" && attendance.remainingLeaves.monthlyPermitted > 0) {
            attendance.remainingLeaves.monthlyPermitted -= 1;
        } else if (leaveType === "Sick Leave" && attendance.remainingLeaves.sickLeave > 0) {
            attendance.remainingLeaves.sickLeave -= 1;
        } else {
            return res.status(400).json({ message: "Leave limit exceeded or invalid leave type" });
        }

        // Update the leave type
        attendance.leave = leaveType;

        // Save updated attendance record
        await attendance.save();

        res.status(200).json({ message: "Leave applied successfully", attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to apply leave" });
    }
};



exports.getAttendanceStatus = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const attendance = await Attendance.findOne({ employeeId }).sort({ date: -1 });
    if (attendance) {
      res.status(200).json({
        success: true,
        status: attendance.checkOutTime ? "checkedOut" : "checkedIn",
      });
    } else {
      res.status(200).json({ success: true, status: "checkedOut" }); // Default to "checkedOut"
    }
  } catch (error) {
    console.error("Error fetching attendance status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance status.",
    });
  }
};
