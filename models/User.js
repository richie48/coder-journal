const mongoose = require('mongoose');

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
  },
  phone: {
    type: String,
    required: [true, 'please enter a phone number'],
    minLength: 11,
  },
  totalArchived: Number,
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

module.exports = mongoose.model('User', userSchema);
