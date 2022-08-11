const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createRefreshToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '3d',
  });
};

const createAccessToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.signup(email, password);
    const token = createAccessToken(user._id, email);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const cookies = req.cookies;
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const accessToken = createAccessToken(user._id, email);
    const refreshToken = createRefreshToken(user._id, email);
    user.refreshToken = refreshToken;
    const result = await user.save();
    res.cookie('jwt', refreshToken, { httpOnly: true, expireIn: '3d' });
    res.status(200).json({ email, accessToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const refresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    res.sendStatus(401);
  }

  const refreshToken = cookies.jwt;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    //unauthorized
    res.sendStatus(403);
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user.email !== decoded.email) {
      res.sendStatus(403);
    }
    const accessToken = createAccessToken(decoded._id, decoded.email);
    res.json({ accessToken });
  });
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = '';
    const result = await user.save();
  }
  res.clearCookie('jwt', { httpOnly: true });
  res.sendStatus(204);
};

module.exports = { signup, login, refresh, logout };
