require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const helmet = require("helmet")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")
const xss = require("xss-clean")
const config = require("./config/config")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const errorHandler = require("./utils/errorHandler")
 

const app = express()

// Connect to MongoDB
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Security Middlewares
app.use(helmet()) // Sets various HTTP headers for security
app.use(
  cors({
    origin: "*", // Adjust as needed for your frontend origin
    credentials: true,
  }),
) // Enable CORS
app.use(express.json()) // Body parser for JSON data
app.use(mongoSanitize()) // Sanitize data to prevent MongoDB Operator Injection
app.use(xss()) // Sanitize data to prevent XSS attacks

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
})
app.use(limiter)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

// Global Error Handler
app.use(errorHandler)

const PORT = config.port || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
