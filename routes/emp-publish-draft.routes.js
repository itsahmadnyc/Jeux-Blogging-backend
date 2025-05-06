const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mediaUploadHandler = require("../middlewares/mediaUploadHandler")
const checkRole = require("../middlewares/checkRole");

const { createBlog,empGetBlogById, empPublishedBlogs, empDraftBlogs, updateEmployeeBlog, employeeStatus, empDeleteOwnBlog } = require("../controllers/employee.controller")





router.post(
    '/create-blog',
    authMiddleware,
    checkRole("employee"),
    mediaUploadHandler,
    createBlog
  );
  router.get('/blog/:id', authMiddleware, checkRole("employee"), empGetBlogById);

  


router.use(authMiddleware, checkRole("employee"));


router.get('/publish-blogs', empPublishedBlogs);
router.get('/draft-blogs', empDraftBlogs);
router.get('/employee-status', employeeStatus);
router.put('/update-blog/:id', updateEmployeeBlog);
router.delete('/blog/:blogId', empDeleteOwnBlog);




module.exports = router;


