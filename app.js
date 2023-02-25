const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoute');
const passport = require('passport');
const restrictor = require('./middlewares/restrictor');
const dbConnect = require('./lib/db.js');
const { db } = require('./models/userModel');
require('./middlewares/auth');
require('dotenv').config();

const app = express();
dbConnect();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(passport.initialize());

app.use('/main', userRoute);
app.use('/message', restrictor, messageRoutes);

module.exports = app;
