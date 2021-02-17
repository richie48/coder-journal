//desc   add notes
//access   private
exports.addNotes = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'note added' });
};

//desc   delete notes
//access   private
exports.deleteNote = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'note deleted' });
};

//desc   add notes
//access   private
exports.updateNote = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'note updated' });
};

//desc   get notes
//access   private
exports.getNote = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'note gotten' });
};
