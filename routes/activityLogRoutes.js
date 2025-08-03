const express = require("express");
const { getActivityLogs } = require("../controllers/activityLogController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/rbac");

const router = express.Router();

router.get("/", protect, authorize("admin"), getActivityLogs);

module.exports = router;
