const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_ACCEPTED,
} = require('http2').constants;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');
const ConflictError = require('../errors/conflictError');
const userModel = require('../models/user');

const { JWT_SECRET = 'secret' } = process.env;

const updateUserById = (req, res, next) => {
  const { name, email } = req.body;
  userModel.findByIdAndUpdate(req.user.id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Invalid Data'));
      }
      return next(err);
    });
};

const getUserInfo = (req, res, next) => {
  userModel.findById(req.user.id)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Invalid Data'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10, (error, hash) => userModel.create({
    name, about, avatar, email, password: hash,
  })
    .then(() => res.status(HTTP_STATUS_CREATED).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('User with this email already register'));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Invalid Data'));
      }
      return next(err);
    }));
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError('The fields email and password must be filled in'));
  }
  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('User does not exist'));
      }
      return bcrypt.compare(password, user.password, (error, isValid) => {
        if (!isValid) {
          return next(new UnauthorizedError('Password is not correct'));
        }

        const token = jwt.sign({
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7),
          id: user._id,
        }, JWT_SECRET);
        return res.status(HTTP_STATUS_OK).cookie('jwt', token).send({ token });
      });
    })
    .catch((err) => next(err));
};

const logout = (req, res) => res.status(HTTP_STATUS_ACCEPTED).clearCookie('jwt').send('cookie cleared');

module.exports = {
  updateUserById,
  createUser,
  login,
  logout,
  getUserInfo,
};
