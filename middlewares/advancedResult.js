const { modelNames } = require('mongoose');

const advancedResult = (model, populate) => async (req, res, next) => {
  const reqQuery = { ...req.query };
  const removeFields = ['select', 'sort', 'page', 'limit'];

  removeFields.forEach((params) => delete reqQuery[params]);

  let query;
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  //The logic to get all notes for a user and the logic to just get all notes

  //reviewing line 19-33
  if (req.params.userId) {
    query = model
      .find({
        user: req.params.userId,
      })
      .populate(populate); //using virtuals

    //why am i forced to use all lowercase to reference a model with populate?
  } else {
    query = model.find(JSON.parse(queryStr)).populate(populate);
  }
  //creating the populate feature
  if (populate) {
    query = query.populate(populate);
  }

  //creating the select feature
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  //creating the sorting feature
  if (req.query.sort) {
    const fields = req.query.sort.split(',').join(' ');
    query = query.sort(fields);
  }

  //for pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page - 1) * limit;
  query = query.skip(skip).limit(limit);

  const results = await query;
  //res.status(200).json({ success: true, data: results });

  res.advancedResult = {
    success: true,
    count: results.length,
    data: results,
  };

  next();
};

module.exports = advancedResult;
