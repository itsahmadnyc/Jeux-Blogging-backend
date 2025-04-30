const express = require('express');
const router = express.Router();
const {uploadMedia} = require('../controllers/uploadController');
const mediaUploadHandler = require("../middlewares/mediaUploadHandler");
const authMiddleware = require('../middlewares/auth.middleware');





router.post('/upload', authMiddleware, mediaUploadHandler, uploadMedia);




module.exports = router;