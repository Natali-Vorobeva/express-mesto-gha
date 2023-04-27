const jwt = require('jsonwebtoken');

const JWT_SECRET = 'where_are_we_going_with_the_Piglet';

const getJwtToken = (id) => {
  const token = jwt.sign({ payload: id }, JWT_SECRET, { expiresIn: '7d' });
  return token;
};

module.exports = getJwtToken;
