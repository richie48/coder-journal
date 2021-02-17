const express = require('express');

const {
  addNotes,
  deleteNote,
  updateNote,
  getNote,
} = require('../controllers/notes');

const router = express.Router();

router.route('/').get(getNote).post(addNotes);
router.route('/:id').put(updateNote).delete(deleteNote);

module.exports = router;
