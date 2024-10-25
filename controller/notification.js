const Notification = require("../models/notification");
exports.create = async (req, res) => {
  try {
    const { message } = req.body;
    const notification = new Notification({ message });
    await notification.save();
    res.status(201).json({ success: true, message: "Notification saved successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save notification", error });
  }
};


// Get all notifications
exports.getAll = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications", error });
  }
};

//delete a notification
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete notification", error });
  }
};