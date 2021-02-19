const mongoose = require('mongoose');
const NotesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please enter a title'],
    maxlength: [50, 'title cannot be more than 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'please enter a description'],
    maxlenth: [300, 'description should not be more than 300 characters'],
  },
  archive: {
    type: String,
    enum: ['archived', 'not-archived'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notes', NotesSchema);
