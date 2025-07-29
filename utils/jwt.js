const jwt = require("jsonwebtoken")
const config = require("../config/config")

const generateToken = (userId, secret, expiresIn) => {
  return jwt.sign({ id: userId }, secret, { expiresIn })
}

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret)
}

const generateAuthTokens = (userId) => {
  const accessToken = generateToken(userId, config.jwt.accessSecret, config.jwt.accessExpiration)
  const refreshToken = generateToken(userId, config.jwt.refreshSecret, config.jwt.refreshExpiration)
  return { accessToken, refreshToken }
}

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
}
