const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  //   const token = user.getSignedToken();
  //res.status(200).json({ success: true, token, user });
  sendTokenResponse(user, 200, res);
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new errorResponse('please enter password or email', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new errorRespose('invalid credentials', 401));
  }

  const match = user.matchPassword(password);
  if (!match) {
    return next(new errorResponse('invalid credentials', 401));
  }
  //const token = user.getSignedToken();
  //res.status(200).json({ success: true, token, user });
  sendTokenResponse(user, '200', res);
});

const sendTokenResponse = (user, status, res) => {
  const token = user.getSignedToken();
  const options = {
    //converted up from milliseconds
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res
    .status(status)
    .cookie('token', token, options)
    .json({ success: true, token, user });
};

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new errorResponse('This user does not exist', 404));
  }
  //calls the get reset token method
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;
  const message = `the link below is to reset password as you requested ${resetUrl}`;

  //the issue with my code is somewhere in this try catch block
  try {
    await sendEmail({
      email,
      subject: 'password reset token',
      message,
    });
  } catch (err) {
    user.getResetPasswordToken = undefined;
    user.getResetPasswordExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new errorResponse('email not sent', 400));
  }
  res.status(200).json({ success: true, user });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new errorResponse('invalid token', 400));
  }
  //sets new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save({ validateBeforeSave: false });
  sendTokenResponse(user, 200, res);
});

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const matched = await user.matchPassword(req.body.currentPassword);

  if (!matched) {
    return next(new errorResponse('current password invalid', 401));
  }
  user.password = req.body.newPassword;
  //I made the issue of not vallidating before saving,that meant that isModified didnt know password was modified
  user.save();
  sendTokenResponse(user, 200, res);
});
