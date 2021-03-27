const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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
    required: true,
  },
  resetPasswordToken: String, //New additions
  resetPasswordExpires: Date,
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
  //User.isModified() is a mongoose function that checks that the user field password is modified
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedToken = function () {
  return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
//Working on this
userSchema.methods.getResetPasswordToken = function () {
  //console.log('i got here');
  const resetToken = crypto.randomBytes(20).toString('hex');
  //we hash our reset password token just like we had done for passwords

  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; //expires in 15 minutes
  return resetToken;
};

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);
