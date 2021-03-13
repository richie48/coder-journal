const mongoose = require('mongoose');
const slugify = require('slugify');

const notesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'please enter a title'],
      maxlength: [50, 'title cannot be more than 50 characters'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'please enter a description'],
      maxlenth: [300, 'description should not be more than 300 characters'],
    },
    archive: {
      type: String,
      enum: ['archived', 'not-archived'],
      default: 'not-archived',
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  }
);

notesSchema.virtual('Notesman', {
  ref: 'User',
  localField: '_id',
  foreignField: 'notes',
  justOne: false,
});

//run this middleware before a note is saved
notesSchema.pre('save', async function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

//Called a static method on model
notesSchema.statics.getTotalArchived = async function (userId) {
  const obj = await this.aggregate([
    {
      $match: {
        user: userId,
        // archive: 'archived',
      },
    },
    {
      $group: {
        _id: `$userId`,
        totalArchived: { $sum: 1 },
      },
    },
  ]);
  try {
    console.log(obj);
    await this.model('User').findByIdAndUpdate(userId, {
      totalArchived: obj[0].totalArchived,
    });
  } catch (err) {
    console.log(err);
  }
};

// this middlewares are run when a note is saved or removed.
notesSchema.post('save', async function (next) {
  this.constructor.getTotalArchived(this.user);
  next();
});
notesSchema.post('remove', async function (next) {
  this.constructor.getTotalArchived(this.user);
  next();
});

module.exports = mongoose.model('Notes', notesSchema);
