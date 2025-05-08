const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { adminStats, adminGetEmpDetailsById } = require("../controllers/admin.stats.controller");
const checkAdmin = require('../middlewares/admin/checkAdmin');





router.get('/admin-stats', authMiddleware, adminStats);
router.get('/emp-blog-details/:id',authMiddleware, adminGetEmpDetailsById)



module.exports = router;
