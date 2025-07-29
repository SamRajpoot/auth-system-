const Joi = require("joi")
const ApiResponse = require("../utils/apiResponse")

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false })
  if (error) {
    const errors = error.details.map((detail) => detail.message)
    return res.status(400).json(ApiResponse.error("Validation failed", errors))
  }
  next()
}

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
})

const updateProfileSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
})

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
})

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
}
