const { verifyToken } = require('./token')

const checkIfLogin = (req, res, next) => {
  try {
    if( req.headers.authorization ){
      verifyToken(req.headers.authorization)
      next()
      
    } else {
      res.status(401).json({ error: 'Unauthorized' })
    }
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

module.exports = {
  checkIfLogin
}