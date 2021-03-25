const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'please enter a first name'],
  },
  lastName: {
    type: String,
    required: [true, 'please enter a last name'],
  },
  email: {
    type: String,
    required: [true, 'please enter your email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email',
    ],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, 'please enter a phone number'],
    minLength: 11,
  },
  role: {
    type: String,
    default: 'user',
  },
  totalArchived: Number,
  password: {
    type: String,
    required: [true, 'please enter a password'],
    select: false,
  },
  resetPasswordToken: String, //New additions
  resetPasswordExpires: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//run this middleware to delete all notes when a user is deleted
userSchema.pre('remove', async function (next) {
  await this.model('Notes').deleteMany({ user: this._id });
  next();
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);
