const express = require('express');

const {
  getUsers,
  deleteUser,
  getUser,
  updateUserDetails,
} = require('../controllers/user');

const { protect, authorize } = require('../middlewares/auth');

router = express.Router();

router.route('/').get(getUsers);
//i dont exactly need my authorize middleware since i only have users and admin,protect can cover that.
router
  .route('/:id')
  .delete(protect, authorize('user', 'admin'), deleteUser)
  .get(getUser);
router
  .route('/updatedetails')
  .put(protect, authorize('user', 'admin'), updateUserDetails);

module.exports = router;
