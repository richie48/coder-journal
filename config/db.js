const mongoose = require('mongoose');

//To connect to mongoose
const connectDb = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(`mongoose running ${conn.connection.host}`);
};
module.exports = connectDb;
