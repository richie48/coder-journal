const express = require('express');

const {
  addNote,
  deleteNote,
  updateNote,
  getNotes,
  getNote,
} = require('../controllers/notes');

const router = express.Router();

router.route('/').get(getNotes).post(addNote);
router.route('/:id').put(updateNote).delete(deleteNote).get(getNote);

module.exports = router;