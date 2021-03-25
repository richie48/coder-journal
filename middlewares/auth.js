const asyncHandler = require('express-async-handler');
const errorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  //Because we want only logged in users to be able to access sole routes we would want
  //to check that the client trying to access a route is logged in
  if (!token) {
    return next(new errorResponse('Not authorised to access this route', 401));
  }
  try {
    //decoded token contains user id
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    //thid is added to our request so we know the detailed of logged in user
    req.user = await User.findById(decodedToken.id);
    next();
  } catch (err) {
    return next(new errorResponse('Not authorised to access this route', 401));
  }
});

//Grant access to specific roles
exports.authorize = (...roles) => async (req, res, next) => {
  //checks if the user trying to access the roles is included above i ...roles
  if (!roles.includes(req.user.role)) {
    return next(
      new errorResponse('user is not authorised to access this route', 403)
    );
  }
  next();
};
