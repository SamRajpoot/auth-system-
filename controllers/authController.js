// --- Email verification and password reset handlers ---
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json(ApiResponse.error("Verification token is required"));
    }
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json(ApiResponse.error("Invalid or expired verification token"));
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json(ApiResponse.success("Email verified successfully. You can now log in."));
  } catch (error) {
    next(error);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json(ApiResponse.success("If that email is registered, a reset link has been sent."));
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href='${resetUrl}'>here</a> to reset your password. This link expires in 1 hour.</p>`
    });
    res.status(200).json(ApiResponse.success("If that email is registered, a reset link has been sent."));
  } catch (error) {
    next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json(ApiResponse.error("Token and new password are required"));
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json(ApiResponse.error("Invalid or expired reset token"));
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json(ApiResponse.success("Password has been reset successfully. You can now log in."));
  } catch (error) {
    next(error);
  }
}
const User = require("../models/User")
const { generateAuthTokens, verifyToken } = require("../utils/jwt")
const ApiResponse = require("../utils/apiResponse")
const config = require("../config/config")
const ActivityLog = require("../models/ActivityLog")
// Removed duplicate crypto require
// Removed duplicate sendEmail require
// const jwt = require("jsonwebtoken")
// const sendEmail = require("../utils/sendEmail")

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

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const user = await User.create({ name, email, password, verificationToken });

    // Send verification email
    const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your email",
      html: `<p>Click <a href='${verifyUrl}'>here</a> to verify your email.</p>`
    });

    const { accessToken, refreshToken } = generateAuthTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: "register",
      ip: req.ip,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(201).json(
      ApiResponse.success("User registered successfully. Please check your email to verify your account.", {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      })
    );



// @desc    Verify email
// @route   GET /api/auth/verify-email?token=...
// @access  Public
async function verifyEmail(req, res, next) {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json(ApiResponse.error("Verification token is required"));
    }
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json(ApiResponse.error("Invalid or expired verification token"));
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(200).json(ApiResponse.success("Email verified successfully. You can now log in."));
  } catch (error) {
    next(error);
  }
}

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json(ApiResponse.success("If that email is registered, a reset link has been sent."));
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      html: `<p>Click <a href='${resetUrl}'>here</a> to reset your password. This link expires in 1 hour.</p>`
    });
    res.status(200).json(ApiResponse.success("If that email is registered, a reset link has been sent."));
  } catch (error) {
    next(error);
  }
}

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
async function resetPassword(req, res, next) {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json(ApiResponse.error("Token and new password are required"));
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json(ApiResponse.error("Invalid or expired reset token"));
    }
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.status(200).json(ApiResponse.success("Password has been reset successfully. You can now log in."));
  } catch (error) {
    next(error);
  }
}
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
    // Always allow admin@example.com to log in, skip email verification
    if (user.email === "admin@example.com") {
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      if (!user.isVerified) {
        return res.status(403).json(ApiResponse.error("Please verify your email before logging in."))
      }
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

    // Log activity
    await ActivityLog.create({
      user: user._id,
      action: "login",
      ip: req.ip,
    });
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

    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      action: "logout",
      ip: req.ip,
    });
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

// --- OTP based login handlers ---
// @desc    Request OTP for login
// @route   POST /api/auth/request-otp
// @access  Public
async function requestOtp(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json(ApiResponse.error("Email is required"));
    }
    const user = await User.findOne({ email });
    if (!user || user.isDeleted) {
      return res.status(200).json(ApiResponse.success("If that email is registered, an OTP has been sent."));
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });
    await sendEmail({
      to: user.email,
      subject: "Your OTP for Login",
      html: `<p>Your OTP for login is <b>${otp}</b>. It expires in 10 minutes.</p>`
    });
    res.status(200).json(ApiResponse.success("If that email is registered, an OTP has been sent."));
  } catch (error) {
    next(error);
  }
}

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json(ApiResponse.error("Email and OTP are required"));
    }
    const user = await User.findOne({ email }).select("+otp +otpExpires +refreshToken");
    if (!user || user.isDeleted) {
      return res.status(401).json(ApiResponse.error("Invalid credentials"));
    }
    if (!user.otp || !user.otpExpires || user.otpExpires < Date.now() || user.otp !== otp) {
      return res.status(401).json(ApiResponse.error("Invalid or expired OTP"));
    }
    // OTP is valid, clear it
    user.otp = undefined;
    user.otpExpires = undefined;
    const { accessToken, refreshToken } = generateAuthTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    res.status(200).json(
      ApiResponse.success("Logged in successfully via OTP", {
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

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  requestOtp,
  verifyOtp,
}
