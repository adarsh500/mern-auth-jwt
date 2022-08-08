const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = (req, res) => {};

const signup = (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = User.signup(email, password);
    console.log(user);
  } catch (err) {
    console.log(error);
  }

  res.status(200).json({});
};

const logout = (req, res) => {};

module.exports = { login, signup, logout };
