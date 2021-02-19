const Notes = require('../models/Notes');

//desc   add notes
//access   private
exports.addNote = async (req, res, next) => {
  try {
    const notes = await Notes.create(req.body);
    res.status(201).json({ success: true, data: notes });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//desc   delete notes
//access   private
exports.deleteNote = async (req, res, next) => {
  try {
    const notes = await Notes.findByIdAndRemove(req.params.id);
    if (!notes) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//desc   add notes
//access   private
exports.updateNote = async (req, res, next) => {
  try {
    const notes = await Notes.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!notes) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//desc   get notes
//access   private
exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Notes.find();
    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//desc   get a note
//access   private
exports.getNote = async (req, res, next) => {
  try {
    const notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: notes });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
