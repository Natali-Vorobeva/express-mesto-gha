const NOT_FOUND_ERROR_CODE = 404;

const notFoundRouter = (req, res, err) => {
  if (err.name === 'CastError') {
    res.status(NOT_FOUND_ERROR_CODE).send({ message: '404 - Страница не найдена.' });
  }
};

module.exports = notFoundRouter;
