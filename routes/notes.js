const express = require('express');
const advancedResult = require('../middlewares/advancedResult');
const Notes = require('../models/Notes');

const {
  addNote,
  deleteNote,
  updateNote,
  getNotes,
  getNote,
  uploadImage,
} = require('../controllers/notes');

const router = express.Router();

router
  .route('/')
  .get(
    advancedResult(Notes, { path: 'user', select: 'firstName lastName' }),
    getNotes
  );
router
  .route('/:id')
  .put(updateNote)
  .delete(deleteNote)
  .get(getNote)
  .post(addNote);
// router.route('/users/:userId/noteid/:id').get(getNote);

router.route('/:id/image').put(uploadImage);
//gets all notes for a user
router
  .route('/users/:userId')
  .get(
    advancedResult(Notes, { path: 'user', select: 'firstName lastName' }),
    getNotes
  );

module.exports = router;
