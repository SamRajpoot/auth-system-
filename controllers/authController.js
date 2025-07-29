const User = require("../models/User")
const { generateAuthTokens, verifyToken } = require("../utils/jwt")
const ApiResponse = require("../utils/apiResponse")
const config = require("../config/config")


// ✅ Do this
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json(ApiResponse.error("User already exists with this email"));
    }

    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateAuthTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // Save refresh token to DB


    // Set refresh token as HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict", // CSRF protection
    });

    res.status(201).json(
      ApiResponse.success("User registered successfully", {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      })
    );
  } catch (error) {
    next(error);
  }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select("+password +refreshToken")
    if (!user || user.isDeleted) {
      return res.status(401).json(ApiResponse.error("Invalid credentials"))
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json(ApiResponse.error("Invalid credentials"))
    }

    const { accessToken, refreshToken } = generateAuthTokens(user._id)
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    })

    res.status(200).json(
      ApiResponse.success("Logged in successfully", {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      }),
    )
  } catch (error) {
    next(error)
  }
}

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (user) {
      user.refreshToken = undefined // Invalidate refresh token in DB
      await user.save({ validateBeforeSave: false })
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.status(200).json(ApiResponse.success("Logged out successfully"))
  } catch (error) {
    next(error)
  }
}

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh-token
// @access  Public (uses refresh token from cookie)
const refreshToken = async (req, res, next) => {
  const cookies = req.headers.cookie
  const refreshTokenCookie = cookies ? cookies.split("; ").find((row) => row.startsWith("refreshToken=")) : null

  if (!refreshTokenCookie) {
    return res.status(401).json(ApiResponse.error("No refresh token found in cookies"))
  }

  const token = refreshTokenCookie.split("=")[1]

  try {
    const decoded = verifyToken(token, config.jwt.refreshSecret)
    const user = await User.findById(decoded.id).select("+refreshToken")

    if (!user || user.isDeleted || user.refreshToken !== token) {
      return res.status(403).json(ApiResponse.error("Invalid refresh token"))
    }

    const { accessToken, refreshToken: newRefreshToken } = generateAuthTokens(user._id)
    user.refreshToken = newRefreshToken
    await user.save({ validateBeforeSave: false })

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    })

    res.status(200).json(ApiResponse.success("Access token refreshed", { accessToken }))
  } catch (error) {
    return res.status(403).json(ApiResponse.error("Invalid or expired refresh token", error.message))
  }
}

module.exports = {
  register,
  login,
  logout,
  refreshToken,
}
