const Attendance = require("../models/attendance");

exports.checkIn = async (req, res) => {
    const { employeeId } = req.body;
    try {
        const attendance = await Attendance.findOneAndUpdate(
            { employee: employeeId, date: { $gte: new Date().setHours(0, 0, 0, 0) } }, // Same day record
            { checkinTime: new Date() },
            { new: true, upsert: true } // Create if not exists
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
            { employee: employeeId, date: { $gte: new Date().setHours(0, 0, 0, 0) } }, // Same day record
            { checkoutTime: new Date() },
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

        const attendance = await Attendance.findOne({ employee: employeeId });

        if (!attendance) return res.status(404).json({ message: "Attendance record not found" });

        if (leaveType === "Monthly Permitted Leave" && attendance.remainingLeaves.monthlyPermitted > 0) {
            attendance.remainingLeaves.monthlyPermitted -= 1;
        } else if (leaveType === "Sick Leave" && attendance.remainingLeaves.sickLeave > 0) {
            attendance.remainingLeaves.sickLeave -= 1;
        } else if (leaveType !== "Loss of Pay Leave") {
            return res.status(400).json({ message: "Leave limit exceeded" });
        }

        attendance.leave = leaveType;
        await attendance.save();

        res.status(200).json({ message: "Leave applied successfully", attendance });
    } catch (error) {
        res.status(500).json({ error: "Failed to apply leave" });
    }
};
