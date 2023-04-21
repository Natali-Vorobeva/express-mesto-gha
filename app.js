const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = { id: '64384e05f46cf560ab1e76bc' };
  next();
});

app.use(router);

app.listen(PORT);
