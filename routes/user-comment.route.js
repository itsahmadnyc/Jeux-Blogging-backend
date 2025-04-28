const express = require('express');
const router = express.Router();

const { getCommentsWithReplies } = require("../controllers/user.controller");
const authMiddleware = require('../middlewares/auth.middleware');





router.get('/comments-replies/:blogId', authMiddleware, getCommentsWithReplies);



module.exports = router;