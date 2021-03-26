const express = require('express');

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/userAuth');

const { protect, authorize } = require('../middlewares/auth');

router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resetToken').put(resetPassword);
router.route('/updatepassword').put(protect, authorize('user'), updatePassword);

module.exports = router;
