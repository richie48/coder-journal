const mongoose = require('mongoose');
const slugify = require('slugify');

const NotesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please enter a title'],
    maxlength: [50, 'title cannot be more than 50 characters'],
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'please enter a description'],
    maxlenth: [300, 'description should not be more than 300 characters'],
  },
  archive: {
    type: String,
    enum: ['archived', 'not-archived'],
    default: 'not-archived',
  },
  slug: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});
//run this middleware before a note is saved
NotesSchema.pre('save', async function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Notes', NotesSchema);
