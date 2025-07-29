const User = require("../models/User")
const ApiResponse = require("../utils/apiResponse")

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ isDeleted: false }).select("-refreshToken")
    res.status(200).json(ApiResponse.success("Users fetched successfully", users))
  } catch (error) {
    next(error)
  }
}

// @desc    Get user profile (Self)
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-refreshToken")
    if (!user || user.isDeleted) {
      return res.status(404).json(ApiResponse.error("User not found"))
    }
    res.status(200).json(ApiResponse.success("Profile fetched successfully", user))
  } catch (error) {
    next(error)
  }
}

// @desc    Update user details (Self)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user || user.isDeleted) {
      return res.status(404).json(ApiResponse.error("User not found"))
    }

    user.name = req.body.name || user.name
    user.email = req.body.email || user.email

    const updatedUser = await user.save()

    res.status(200).json(
      ApiResponse.success("Profile updated successfully", {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      }),
    )
  } catch (error) {
    next(error)
  }
}

// @desc    Change user password (Self)
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user.id).select("+password")
    if (!user || user.isDeleted) {
      return res.status(404).json(ApiResponse.error("User not found"))
    }

    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json(ApiResponse.error("Current password is incorrect"))
    }

    user.password = newPassword // Pre-save hook will hash it
    await user.save()

    res.status(200).json(ApiResponse.success("Password changed successfully"))
  } catch (error) {
    next(error)
  }
}

// @desc    Soft delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const softDeleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json(ApiResponse.error("User not found"))
    }

    user.isDeleted = true
    await user.save({ validateBeforeSave: false })

    res.status(200).json(ApiResponse.success("User soft deleted successfully"))
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllUsers,
  getProfile,
  updateProfile,
  changePassword,
  softDeleteUser,
}
