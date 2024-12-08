const express = require("express");
const getCountries = require('../controllers/countries');
const authenticate = require('../midlewares/authenticate');
const getPersonDocTypes = require('../controllers/personDocType');

const directoryRoute = express();

directoryRoute.get('/countries', authenticate,  getCountries);

directoryRoute.get("/doctype", authenticate, getPersonDocTypes);

module.exports = directoryRoute;