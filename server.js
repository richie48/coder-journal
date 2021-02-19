const dotenv = require('dotenv');
const express = require('express');
const notes = require('./routes/notes');
const logger = require('./middlewares/logger');
const morgan = require('morgan');

dotenv.config({ path: './config/config.env' });

const connectDb = require('./config/db');
connectDb();

const app = express();

const server = app.listen(process.env.PORT, console.log('server running'));

//app.use(logger);

//dev logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Handling promise rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`error:${err.message}`);
  server.close(() => process.exit(1));
});

app.use(express.json());
app.use('/api/v1/notes', notes);
