const express = require('express');

const {
  getUsers,
  deleteUser,
  getUser,
  updateUserDetails,
  createUser,
} = require('../controllers/user');

const { protect, authorize } = require('../middlewares/auth');

router = express.Router();

router.route('/').get(authorize('admin'), getUsers).post(createUser);
//i dont exactly need my authorize middleware since i only have users and admin,protect can cover that.
router
  .route('/:id')
  .delete(protect, authorize('user', 'admin'), deleteUser)
  .get(getUser);
router
  .route('/updatedetails')
  .put(protect, authorize('user', 'admin'), updateUserDetails);

module.exports = router;
