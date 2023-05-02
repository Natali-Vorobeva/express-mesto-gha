const NotFoundError = require('../utils/errors/not-found');

const notFoundController = (req, res, next) => {
  next(new NotFoundError('404 - Страница не найдена'));
};

module.exports = notFoundController;
