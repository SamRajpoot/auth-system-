const express = require("express")
const { register, login, logout, refreshToken } = require("../controllers/authController")
const { protect } = require("../middleware/auth")
const { validate, registerSchema, loginSchema } = require("../middleware/validation")

const router = express.Router()

router.post("/register", validate(registerSchema), register)
router.post("/login", validate(loginSchema), login)
router.post("/logout", protect, logout)
router.post("/refresh-token", refreshToken)

module.exports = router
