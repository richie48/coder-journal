const Notes = require('../models/Notes');
const User = require('../models/User');
const advancedResult = require('../middlewares/advancedResult');

const asyncHandler = require('express-async-handler');
const colors = require('colors');
const errorResponse = require('../utils/errorResponse');
//desc   add note
//access   private
exports.addNote = asyncHandler(async (req, res, next) => {
  //create a field user in the body of the note we are creating,and puts the id in it.
  req.body.user = req.params.id;
  //check if the user exist
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new errorResponse(`this user ${req.params.id} does not exist`, 404)
    );
  }
  const note = await Notes.create(req.body);
  res.status(201).json({ success: true, data: note });
});

//desc   delete notes
//access   private
exports.deleteNote = asyncHandler(async (req, res, next) => {
  //We didn't need to check if the user exist to delete a note,we can handle that in the frontend
  let note = await Notes.findById(req.params.id);
  if (!note) {
    return next(err);
  }
  await note.remove();
  res.status(200).json({ success: true, data: note });
});

//desc   add notes
//access   private
exports.updateNote = asyncHandler(async (req, res, next) => {
  //We didn't need to check if the user exist to update a note,we can handle that in the frontend
  let notes = await Notes.findById(req.params.id);
  if (!notes) {
    return next(err);
  }

  notes = await Notes.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: notes });
});

//desc   get notes and also get notes for a particular user.
//access   private
exports.getNotes = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
  //   const reqQuery = { ...req.query };
  //   const removeFields = ['select', 'sort', 'page', 'limit'];

  //   removeFields.forEach((params) => delete reqQuery[params]);

  //   let query;
  //   let queryStr = JSON.stringify(reqQuery);
  //   queryStr = queryStr.replace(
  //     /\b(gt|gte|lt|lte|in)\b/g,
  //     (match) => `$${match}`
  //   );

  //   //The logic to get all notes for a user and the logic to just get all notes
  //   if (req.params.userId) {
  //     query = Notes.find({
  //       user: req.params.userId,
  //     }).populate({ path: 'user', select: 'firstName lastName' }); //using virtuals

  //     //why am i forced to use all lowercase to reference a model with populate?
  //   } else {
  //     query = Notes.find(JSON.parse(queryStr));
  //   }

  //   //creating the select feature
  //   if (req.query.select) {
  //     const fields = req.query.select.split(',').join(' ');
  //     query = query.select(fields);
  //   }
  //   //creating the sorting feature
  //   if (req.query.sort) {
  //     const fields = req.query.sort.split(',').join(' ');
  //     query = query.sort(fields);
  //   }

  //   //for pagination
  //   const page = parseInt(req.query.page, 10) || 1;
  //   const limit = parseInt(req.query.limit, 10) || 100;
  //   const skip = (page - 1) * limit;
  //   query = query.skip(skip).limit(limit);

  //   const notes = await query;
  //   res.status(200).json({ success: true, data: notes });
});

//desc   get a note
//access   private
exports.getNote = asyncHandler(async (req, res, next) => {
  //We didn't need to check if the user exist to get a note,we can handle that in the frontend
  const note = await Notes.findById(req.params.id).populate({
    path: 'user',
    select: 'firstName lastName',
  });
  if (!note) {
    return next(err);
  }
  // const userNotes = await Notes.find({
  //   user: req.params.userId,
  // });
  // if (!userNotes) {
  //   next(err);
  // }
  //I had an issue with checking if the user exist or even has a note
  res.status(200).json({ success: true, data: note });
  // }
});

//desc   add an image
//access   private
exports.uploadImage = asyncHandler(async (req, res, next) => {
  const notes = await Notes.findById(req.params.id);

  //check if the note exist
  if (!notes) {
    return next(
      new errorResponse(`The note with id ${req.params.id} is not found`, 404)
    );
  }
  if (!req.files) {
    return next(new errorResponse(`the file doesnt exist`, 400));
  }
  //check if the image uploaded was actually an image
  if (!req.files.file.mimetype.startsWith('image')) {
    return next(new errorResponse(`please upload an image file`, 400));
  }
  if (req.files.file.size > process.env.MAX_FILE_SIZE) {
    return next(
      new errorResponse(
        `file uploaded larger than limit of ${process.env.MAX_FILE_SIZE}`,
        400
      )
    );
  }
  const file = req.files.file;
  file.name = `photo_${notes._id}_${req.files.file.name}`;
  console.log(file.name);
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new errorResponse('problem with upload', 500));
    }
  });
  const note = await Notes.findByIdAndUpdate(
    req.params.id,
    {
      photo: file.name,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({ success: true, data: note });
});
