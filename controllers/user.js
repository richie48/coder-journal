const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const colors = require('colors');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    next(err);
  }
  user.remove();
  res.status(200).json({ success: true, data: {} });
});

//desc   get a note
//access   private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    next(err);
  }
  res.status(200).json({ success: true, data: user });
});

//Update user details
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  //To update user name or email
  const firstName = req.body.firstName;
  const email = req.body.email;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { email, firstName },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({ success: true, user });
});
