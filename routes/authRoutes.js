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


const { verifyEmail, forgotPassword, resetPassword } = require("../controllers/authController");

router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.json({ success: true, message: "Google login successful", user: req.user });
  }
);

// GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.json({ success: true, message: "GitHub login successful", user: req.user });
  }
);

module.exports = router
