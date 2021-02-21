const Notes = require('../models/Notes');
const asyncHandler = require('express-async-handler');

//desc   add note
//access   private
exports.addNote = asyncHandler(async (req, res, next) => {
  const notes = await Notes.create(req.body);
  res.status(201).json({ success: true, data: notes });
});

//desc   delete notes
//access   private
exports.deleteNote = asyncHandler(async (req, res, next) => {
  const notes = await Notes.findByIdAndRemove(req.params.id);
  if (!notes) {
    next(err);
  }
  res.status(200).json({ success: true, data: notes });
});

//desc   add notes
//access   private
exports.updateNote = asyncHandler(async (req, res, next) => {
  const notes = await Notes.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!notes) {
    next(err);
  }
  res.status(200).json({ success: true, data: notes });
});

//desc   get notes
//access   private
exports.getNotes = asyncHandler(async (req, res, next) => {
  const notes = await Notes.find();
  res.status(200).json({ success: true, data: notes });
});

//desc   get a note
//access   private
exports.getNote = asyncHandler(async (req, res, next) => {
  const notes = await Notes.findById(req.params.id);
  if (!notes) {
    next(err);
  }
  res.status(200).json({ success: true, data: notes });
});
