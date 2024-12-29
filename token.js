const jwt = require('jsonwebtoken');



// Create the token
const createToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '7d'});

// Verify the token
const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);


module.exports = {
  createToken,
  verifyToken
}