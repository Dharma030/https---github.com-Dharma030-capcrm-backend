const jwt = require('jsonwebtoken');
const { userTypes } = require('../utils/constants');
const User = require('../Models/user');

const verifyToken = (req, res, next) => {
  const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
  let token = req.headers["x-access-token"];
console.log(req.headers)
  if (!token) {
    return res.status(403).send({ message: 'No Token Provided' });
  }

  jwt.verify(token,process.env.TOKEN_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).send({ message: 'Invalid JWT token' });
    }
    req.username = payload.username;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  const user = await User.findOne({ username: req.username });

  if (user && user.userTypes === userTypes.admin) {
    next();
  } else {
    return res.status(403).send({ message: 'Only Admin users are allowed to access this route!' });
  }
};

const isAdminOrOwnUser = async (req, res, next) => {
  const user = await User.findOne({ username: req.username });

  if ((user && user.userTypes === userTypes.admin) || req.params.id === user.id) {
    next();
  } else {
    return res
      .status(403)
      .send({ message: 'Only admin or own user is allowed to access this route!' });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isAdminOrOwnUser,
};
