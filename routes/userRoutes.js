const express = require("express")
const {
  getAllUsers,
  getProfile,
  updateProfile,
  changePassword,
  softDeleteUser,
} = require("../controllers/userController")
const { protect } = require("../middleware/auth")
const { authorize } = require("../middleware/rbac")
const { validate, updateProfileSchema, changePasswordSchema } = require("../middleware/validation")

const router = express.Router()

// Admin routes
router.get("/", protect, authorize("admin"), getAllUsers)
router.delete("/:id", protect, authorize("admin"), softDeleteUser)

// User routes
router.get("/profile", protect, getProfile)
router.put("/profile", protect, validate(updateProfileSchema), updateProfile)
router.put("/change-password", protect, validate(changePasswordSchema), changePassword)

module.exports = router
