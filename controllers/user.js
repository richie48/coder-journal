const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const colors = require('colors');

exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ success: true, data: users });
});

// This will contain a controller and the a seperate controller will be created for the aytheticatio of users.
