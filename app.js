const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const app = express();
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { id: '643d23ec3ad8a2cbc0ea9da7' }
  next();
});

app.use(router);

app.listen(3000, () => {
  console.log('start server');
})