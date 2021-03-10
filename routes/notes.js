const express = require('express');

const {
  addNote,
  deleteNote,
  updateNote,
  getNotes,
  getNote,
} = require('../controllers/notes');

const router = express.Router();

router.route('/').get(getNotes);
router
  .route('/:id')
  .put(updateNote)
  .delete(deleteNote)
  .get(getNote)
  .post(addNote);
// router.route('/users/:userId/noteid/:id').get(getNote);

//gets all notes for a user
router.route('/users/:userId').get(getNotes);

module.exports = router;
