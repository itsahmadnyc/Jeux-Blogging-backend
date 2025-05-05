const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const checkEmployee = require('../middlewares/employee/checkEmployee');
const checkRole = require("../middlewares/checkRole");

const {empPublishedBlogs, empDraftBlogs} = require("../controllers/employee.controller")





router.get('/publish-blogs', authMiddleware, checkRole("employee"), empPublishedBlogs);
router.get('/draft-blogs', authMiddleware, checkRole("employee"), empDraftBlogs);




module.exports = router;