const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required!'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
    minlength: [6, 'Password must be at least 6 characters long!'],
    select: true 
  },
  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Added OTP fields for registration and authentication support
  otp: {
    type: String,
    default: null
  },
  otpExpire: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// 1. Hash password securely using async/await without next()
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. Method to compare entered password with hashed password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;