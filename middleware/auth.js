const jwt = require("jsonwebtoken");
const User = require("../models/User");
const config = require("../config/config");
const ApiResponse = require("../utils/apiResponse");

// const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
//     try {
//       token = req.headers.authorization.split(" ")[1];
//       const decoded = jwt.verify(token, config.jwt.accessSecret);

//       const user = await User.findById(decoded.id).select("-password -refreshToken");

//       if (!user || user.isDeleted) {
//         return res
//           .status(401)
//           .json(ApiResponse.error("Not authorized, user not found or deleted"));
//       }

//       req.user = user;
//       next();
//     } catch (error) {
//       return res
//         .status(401)
//         .json(ApiResponse.error("Not authorized, token failed or expired", error.message));
//     }
//   } else {
//     return res
//       .status(401)
//       .json(ApiResponse.error("Not authorized, no token"));
//   }
// };

const protect = async (req, res, next) => {
  console.log("AUTH HEADERS:", req.headers);
  let token;

  console.log("AUTH HEADERS:", req.headers); // <-- Debug log

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Extracted Token:", token); // <-- Debug log


      const decoded = jwt.verify(token, config.jwt.accessSecret);
      const user = await User.findById(decoded.id).select("-password -refreshToken");

      if (!user || user.isDeleted) {
        return res.status(401).json(ApiResponse.error("Not authorized, user not found or deleted"));
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json(ApiResponse.error("Not authorized, token failed or expired", error.message));
    }
  } else {
    return res.status(401).json(ApiResponse.error("Not authorized, no token"));
  }
};


 module.exports = { protect };


