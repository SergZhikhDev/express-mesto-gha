/* eslint-disable arrow-body-style */
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'very_secret';

const generateToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY);
};

const checkToken = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { generateToken, checkToken };
