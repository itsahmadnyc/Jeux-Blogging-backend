// Add this to your upload.routes.js file temporarily
const express = require('express');
const router = express.Router();
const {allAdsMediaFiles, uploadMedia, uploadMediaWithTitle, deleteMediaFile} = require('../controllers/uploadController.js');
const mediaUploadHandler = require("../middlewares/mediaUploadHandler");
const authMiddleware = require('../middlewares/auth.middleware');




router.get('/ads-media',  allAdsMediaFiles);
router.post('/upload', authMiddleware, mediaUploadHandler, uploadMedia);
router.post('/media-upload', authMiddleware, mediaUploadHandler, uploadMediaWithTitle); 
router.delete('/media-delete/:id', authMiddleware, deleteMediaFile);

module.exports = router;