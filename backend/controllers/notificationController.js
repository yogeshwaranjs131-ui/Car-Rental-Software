const Notification = require('../models/Notification');
const { sendNotificationToUser } = require('../services/notificationService');

// 1. Create a Notification (And automatically send to Gmail & WhatsApp with logo for any user)
const createNotification = async (req, res) => {
  try {
    // 1. Save the notification in the database
    const newNotification = new Notification(req.body);
    await newNotification.save();

    // 2. Get user's Email, Phone, and custom message from req.body
    const { email, phone, message } = req.body;

    // 3. If user's Email and Phone exist, automatically trigger the logo notification
    if (email && phone) {
      const otpCode = Math.floor(100000 + Math.random() * 900000); // Generates a dynamic 6-digit OTP
      await sendNotificationToUser(email, phone, otpCode);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Notification created and sent via Email & WhatsApp successfully!', 
      notification: newNotification 
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Get All Notifications
const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Delete a Notification
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Notification deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createNotification,
  getAllNotifications,
  deleteNotification
};