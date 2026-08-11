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
  }
}, {
  timestamps: true
});

// 1. next-ஐத் தவிர்த்துவிட்டு, async/await மூலமாக நேரடியாக ஹேஷ் செய்யும் முறை (மிகவும் பாதுகாப்பானது)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 2. லாகின் செய்யும்போது பாஸ்வேரைச் சரிபார்க்கும் மெதட்
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;