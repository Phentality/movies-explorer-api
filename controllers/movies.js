const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('http2').constants;
const mongoose = require('mongoose');
const movieModel = require('../models/movie');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const getMovies = (req, res, next) => {
  const ownerID = req.user.id;
  movieModel.find({ owner: ownerID })
    .then((movie) => res.status(HTTP_STATUS_OK).send(movie))
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  const movieID = req.params.id;
  const ownerID = req.user.id;
  return movieModel.findById(movieID).orFail()
    .then((data) => {
      if (!data.owner.equals(ownerID)) {
        throw new ForbiddenError('That movie not yours');
      }
      return movieModel.findByIdAndRemove(movieID)
        .then((movie) => {
          res.status(HTTP_STATUS_OK).send({ data: movie });
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Movie not found'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Invalid ID'));
      }
      return next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    id,
    nameRU,
    nameEN,
  } = req.body;
  return movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user.id,
    id,
    nameRU,
    nameEN,
  })
    .then((movie) => res.status(HTTP_STATUS_CREATED).send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Invalid Data'));
      }
      return next(err);
    });
};

module.exports = {
  getMovies,
  deleteMovie,
  createMovie,
};
