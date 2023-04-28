const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../utils/errors/unauthorized');

module.exports = (req, res, next) => {
  const { autorization } = req.headers;
  if (!autorization || autorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = autorization.replace('Bearer', '');
  let payload;
  try {
    payload = jwt.verify(token, 'where_are_we_going_with_the_Piglet');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  next();
};
