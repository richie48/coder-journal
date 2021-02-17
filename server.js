const dotenv = require('dotenv');
const express = require('express');
const notes = require('./routes/notes');
const logger = require('./middlewares/logger');
const morgan = require('morgan');

dotenv.config({ path: './config/config.env' });

const app = express();

app.listen(process.env.PORT, console.log('server running'));

//app.use(logger);

//dev logger middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/v1/notes', notes);
