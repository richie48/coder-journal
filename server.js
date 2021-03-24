const dotenv = require('dotenv');
const express = require('express');
const notes = require('./routes/notes');
const userRoutes = require('./routes/userRoutes');
const userAuth = require('./routes/userAuth');
const logger = require('./middlewares/logger');
const morgan = require('morgan');
const errorHandler = require('./middlewares/error');
const colors = require('colors');
const asyncHandler = require('express-async-handler');
const expressFileUpload = require('express-fileupload');
const path = require('path');
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config/config.env' });

const connectDb = require('./config/db');
connectDb();

const app = express();

const server = app.listen(process.env.PORT, console.log('server running'));

//app.use(logger);

//Handling promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`error:${err.message}`);
  server.close(() => process.exit(1));
});

//dev logger middleware,important to mount
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//To use json data in the body of our request
app.use(express.json());

app.use(expressFileUpload());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static('public'));
app.use(cookieParser());
//To mount routes
app.use('/api/v1/notes', notes);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/auth', userAuth);

//Mount global installed middleware
app.use(asyncHandler());

//To mount the error handler(important to mount the middleware after the route we need it in is called)
app.use(errorHandler);
