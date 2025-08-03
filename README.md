# Auth System

A Node.js authentication system with JWT, email verification, password reset, social login (Google, GitHub), OTP login, RBAC, and activity logging.

## Folder Structure

```
.
├── .env
├── .gitignore
├── config/
│   ├── config.js
│   └── passport.js
├── controllers/
│   ├── activityLogController.js
│   ├── authController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   ├── rbac.js
│   └── validation.js
├── models/
│   ├── ActivityLog.js
│   └── User.js
├── node_modules/
├── package.json
├── package-lock.json
├── routes/
│   ├── activityLogRoutes.js
│   ├── authRoutes.js
│   └── userRoutes.js
├── server.js
└── utils/
    ├── apiResponse.js
    ├── errorHandler.js
    ├── jwt.js
    └── sendEmail.js
```

## Description
- **config/**: App and passport configuration files
- **controllers/**: Route handler logic for authentication, users, and activity logs
- **middleware/**: Auth, RBAC, and validation middleware
- **models/**: Mongoose models (User, ActivityLog)
- **routes/**: Express route definitions
- **utils/**: Utility functions (API response, error handler, JWT, email)
- **server.js**: Main Express app entry point

## Setup
1. Install dependencies: `npm install`
2. Configure `.env` with your secrets and database URI
3. Start the server: `npm start`

## License
MIT
