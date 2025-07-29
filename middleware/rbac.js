const ApiResponse = require("../utils/apiResponse")

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(ApiResponse.error(`User role ${req.user.role} is not authorized to access this route`))
    }
    next()
  }
}

module.exports = { authorize }
