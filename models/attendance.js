const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    checkinTime: { type: Date, default: null },
    checkoutTime: { type: Date, default: null },
    leave: {
        type: String,
        enum: ["Monthly Permitted Leave", "Sick Leave", "Loss of Pay Leave"],
        default: null,
    },
    remainingLeaves: {
        monthlyPermitted: { type: Number, default: 2 }, // 2 per month
        sickLeave: { type: Number, default: 12 },       // 12 per year
    },
});
module.exports = mongoose.model("Attendance", attendanceSchema);
