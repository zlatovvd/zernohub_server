const express = require('express');
const authenticate = require('../midlewares/authenticate');
const getReceipt = require('../controllers/receipt');

const receiptRoute = express();

receiptRoute.get('/create', authenticate, getReceipt);

module.exports = receiptRoute;