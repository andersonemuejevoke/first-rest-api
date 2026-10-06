require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger, logEvents } = require('./middleware/logEmitters');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

connectDB();

// creating custom middleware
app.use(logger);

// handles options credentials check before CORS and fetch cookies credentials requirement
app.use(credentials);
app.use(cors(corsOptions));
// built-in middleware to
// Handles form data
app.use(express.urlencoded({ extended: false }));
// Handles json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());
// Serves static files
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));
// Handles routing
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdir'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/employees', verifyJWT, require('./routes/api/employees'));
app.use('/users', verifyJWT, require('./routes/api/users'));

// Caughts any routes not defined
app.all('*splat', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// Handles erros
app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`);
  });
}

module.exports = app;
