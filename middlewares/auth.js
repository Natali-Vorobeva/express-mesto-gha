const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { autorization } = req.headers;
  if (!autorization || autorization.startsWith('Bearer ')) {
    return res.status(401)
      .send({ message: 'Необходима авторизация' });
  }
  const token = autorization.replace('Bearer', '');
  let payload;
  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  next();
};
