const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.sendStatus(401);
  }

  //Bearer token
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      //token is present but invalid
      return res.sendStatus(403);
    }

    //decoded contains the data we pass using the token
    req.email = decoded.email;
    next();
  });
};

module.exports = { verifyJWT };
