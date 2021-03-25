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

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(
    advancedResult(Notes, { path: 'user', select: 'firstName lastName' }),
    getNotes
  );
router
  .route('/:id')
  .put(protect, authorize('user'), updateNote)
  .delete(protect, authorize('user', 'admin'), deleteNote)
  .get(getNote)
  .post(protect, authorize('user'), addNote);
// router.route('/users/:userId/noteid/:id').get(getNote);

router.route('/:id/image').put(protect, authorize('user'), uploadImage);
//gets all notes for a user
router
  .route('/users/:userId')
  .get(
    protect,
    advancedResult(Notes, { path: 'user', select: 'firstName lastName' }),
    getNotes
  );

module.exports = router;
