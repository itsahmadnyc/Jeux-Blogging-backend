const express = require('express');
const router = express.Router();
const {getAllBlogsWithComments, deleteComment} = require("../controllers/comments.controller");
const authMiddleware = require('../middlewares/auth.middleware');



router.get('/comments', getAllBlogsWithComments);

router.delete('/delete-comment/:commentId',authMiddleware, deleteComment)






module.exports = router;