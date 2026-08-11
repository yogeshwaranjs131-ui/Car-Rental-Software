const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient reference is required!']
  },
  title: {
    type: String,
    required: [true, 'Title is required!'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required!'],
    trim: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['booking', 'payment', 'system', 'promotion'],
    default: 'system'
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;