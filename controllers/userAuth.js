const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');

exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = user.getSignedToken();

  res.status(200).json({ success: true, token, user });
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new errorResponse('please enter password or email', 400));
  }
  const user = await User.findOne({ email }).select('+passowrd');
  if (!user) {
    next(new errorRespose('invalid credentials', 401));
  }

  const match = user.matchPassword(password);
  if (!match) {
    next(new errorResponse('invalid credentials', 401));
  }

  const token = user.getSignedToken();
  res.status(200).json({ success: true, token, user });
});
