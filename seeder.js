const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

//load model
const User = require('./models/User');

//connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

//read the json file
//__dirname looks at the present directory of the seeder
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/usertestdata.json`, 'utf-8')
);

const importData = async () => {
  try {
    const user = await User.create(users);
    console.log('Data imported'.blue.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    const user = await User.deleteMany();
    console.log('Data destroyed'.red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
