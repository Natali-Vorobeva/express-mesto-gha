const router = require('express').Router();

const usersRouter = require('./users');
const cardsRouter = require('./cards');

const NOT_FOUND_ERROR_CODE = 404;

const notFoundRouter = (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: '404 - Страница не найдена' });
};

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use('/*', notFoundRouter);

module.exports = router;
