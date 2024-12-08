const express = require('express');
const directoryRoute = require('./routes/directoryRoute');
const receiptRoute = require('./routes/receiptRoute');

const app = express();

app.use("/directory", directoryRoute);
app.use("/receipt", receiptRoute);

app.use((req, res) => {
	res.status(404).json({ message: "404 Page not found" })
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;