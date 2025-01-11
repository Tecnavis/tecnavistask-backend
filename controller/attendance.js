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

        const today = new Date().toISOString().split("T")[0]; // Current date without time
        let attendance = await Attendance.findOne({
            employee: employeeId,
            date: { $gte: new Date(today), $lt: new Date(today + "T23:59:59.999Z") },
        });

        if (attendance && attendance.leave) {
            return res.status(400).json({ message: "Leave already applied for today." });
        }

        if (!attendance) {
            attendance = new Attendance({ employee: employeeId });
        }

        // Handle leave deduction logic
        if (leaveType === "Monthly Permitted Leave") {
            if (attendance.remainingLeaves.monthlyPermitted <= 0) {
                return res.status(400).json({ message: "No Monthly Permitted Leaves remaining." });
            }
            attendance.remainingLeaves.monthlyPermitted -= 1;
        } else if (leaveType === "Sick Leave") {
            if (attendance.remainingLeaves.sickLeave <= 0) {
                return res.status(400).json({ message: "No Sick Leaves remaining." });
            }
            attendance.remainingLeaves.sickLeave -= 1;
        } // Loss of Pay Leave does not affect remainingLeaves

        attendance.leave = leaveType;
        attendance.date = new Date(); // Apply leave for today
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
// Fetch attendance records for a specific employee
// exports.getAttendanceRecords = async (req, res) => {
//     const { employeeId } = req.params;
//     try {
//       const attendanceRecords = await Attendance.find({ employee: employeeId });
//       res.status(200).json({ success: true, data: attendanceRecords });
//     } catch (error) {
//       console.error("Error fetching attendance records:", error);
//       res.status(500).json({ success: false, message: "Server Error" });
//     }
//   };
  
  // Edit check-in and check-out times for a specific record
  exports.editAttendanceRecord = async (req, res) => {
    const { recordId } = req.params;
    const { checkinTime, checkoutTime } = req.body;
  
    try {
      const attendance = await Attendance.findOneAndUpdate(
        { "records._id": recordId },
        {
          $set: {
            "records.$.checkinTime": checkinTime,
            "records.$.checkoutTime": checkoutTime,
          },
        },
        { new: true }
      );
  
      if (!attendance) {
        return res
          .status(404)
          .json({ success: false, message: "Attendance record not found" });
      }
  
      res.status(200).json({
        success: true,
        message: "Attendance record updated successfully",
        data: attendance,
      });
    } catch (error) {
      console.error("Error updating attendance record:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };