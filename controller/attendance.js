const Attendance = require("../models/attendance");
exports.checkIn = async (req, res) => {
    try {
        const { employeeId } = req.body;
        const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD

        let attendance = await Attendance.findOne({ employee: employeeId, date: today });

        if (!attendance) {
            attendance = await Attendance.create({ employee: employeeId, checkinTime: new Date() });
            return res.status(201).json({ message: "Check-in successful", attendance });
        } else {
            return res.status(400).json({ message: "Already checked in today" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to check-in" });
    }
};

exports.checkOut = async (req, res) => {
    try {
        const { employeeId } = req.body;
        const today = new Date().toISOString().slice(0, 10);

        const attendance = await Attendance.findOne({ employee: employeeId, date: today });

        if (attendance && !attendance.checkoutTime) {
            attendance.checkoutTime = new Date();
            await attendance.save();
            return res.status(200).json({ message: "Check-out successful", attendance });
        } else {
            return res.status(400).json({ message: "Check-out failed. Either not checked in or already checked out." });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to check-out" });
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
