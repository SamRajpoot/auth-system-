const jwt = require("jsonwebtoken")
const User = require("../models/User")
const config = require("../config/config")
const ApiResponse = require("../utils/apiResponse")

const protect = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, config.jwt.accessSecret)
      req.user = await User.findById(decoded.id).select("-password -refreshToken")
      if (!req.user || user.isDeleted) {
        return res.status(401).json(ApiResponse.error("Not authorized, user not found or deleted"))
      }
      next()
    } catch (error) {
      return res.status(401).json(ApiResponse.error("Not authorized, token failed or expired", error.message))
    }
  }

  if (!token) {
    return res.status(401).json(ApiResponse.error("Not authorized, no token"))
  }
}

module.exports = { protect }
