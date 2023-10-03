const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const {
  createUser, login, logout,
} = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.use(auth);
router.post('/signout', logout);
router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('*', (req, res, next) => next(new NotFoundError('check API instruction')));

module.exports = router;
