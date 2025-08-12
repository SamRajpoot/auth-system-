const express = require("express")
const { register, login, logout, refreshToken } = require("../controllers/authController")
const { protect } = require("../middleware/auth")
const { validate, registerSchema, loginSchema } = require("../middleware/validation")
const passport = require("../config/passport");

const router = express.Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/logout", protect, logout)
router.post("/refresh-token", refreshToken)


const { verifyEmail, forgotPassword, resetPassword, requestOtp, verifyOtp } = require("../controllers/authController");

router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// OTP based login
router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    // Issue JWT token for the user
    const { generateAuthTokens } = require("../utils/jwt");
    const { accessToken } = generateAuthTokens(req.user._id);
    // Redirect to frontend with token and user info
    const userStr = encodeURIComponent(JSON.stringify({
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      isVerified: req.user.isVerified
    }));
    res.redirect(`http://localhost:3000/oauth-callback?provider=google&token=${accessToken}&user=${userStr}`);
  }
);

// GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    // Issue JWT token for the user
    const { generateAuthTokens } = require("../utils/jwt");
    const { accessToken } = generateAuthTokens(req.user._id);
    // Redirect to frontend with token and user info
    const userStr = encodeURIComponent(JSON.stringify({
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      isVerified: req.user.isVerified
    }));
    res.redirect(`http://localhost:3000/oauth-callback?provider=github&token=${accessToken}&user=${userStr}`);
  }
);

module.exports = router
