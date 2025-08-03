const ActivityLog = require("../models/ActivityLog");
const ApiResponse = require("../utils/apiResponse");

// @desc    Get activity logs with filters and pagination
// @route   GET /api/activity-logs
// @access  Private/Admin
exports.getActivityLogs = async (req, res, next) => {
  try {
    let { page = 1, limit = 20, user, action, start, end } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};
    if (user) query.user = user;
    if (action) query.action = action;
    if (start || end) {
      query.createdAt = {};
      if (start) query.createdAt.$gte = new Date(start);
      if (end) query.createdAt.$lte = new Date(end);
    }

    const logs = await ActivityLog.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ActivityLog.countDocuments(query);

    res.status(200).json(
      ApiResponse.success("Activity logs fetched", {
        logs,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      })
    );
  } catch (error) {
    next(error);
  }
};
