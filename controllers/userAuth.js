const User = require('../models/User');
const errorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');

exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  const token = user.getSignedToken();

  res.status(200).json({ success: true, token, user });
});
