const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');

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
