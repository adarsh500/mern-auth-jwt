const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (_id, refresh_token = true) => {
  const expireIn = refresh_token ? '1d' : '3d';
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: expireIn });
};

const signup = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.signup(email, password);
    const token = createToken(user._id, true);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const cookies = req.cookies;
  console.log('req cook', cookies?.jwt);
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.login(email, password);
    const accessToken = createToken(user._id);
    const refreshToken = createToken(user._id, false);
    res.cookie('jwt', refreshToken, { httpOnly: true, expireIn: '3d' });
    res.status(200).json({ email, accessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const logout = (req, res) => {};

module.exports = { login, signup, logout };
