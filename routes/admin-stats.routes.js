const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { adminStats } = require("../controllers/admin.stats.controller");





router.get('/admin-stats', authMiddleware, adminStats);



module.exports = router;
