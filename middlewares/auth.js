const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorizedError');
require('dotenv').config();

const { JWT_SECRET = 'secret' } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Authorization required'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Authorization required'));
  }

  req.user = payload;

  return next();
};
