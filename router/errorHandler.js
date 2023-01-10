const express = require('express');
const router = express.Router();

const errorHandler = (err, req, res, next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).send({ message: err.message });
};

module.exports = errorHandler;