const express = require('express');
const router = express.Router();
const {
  createAdsMedia,
  getAllAdsMedia,
  getAdsMediaById,
  getAdsMediaByUserId,
  updateAdsMedia,
  deleteAdsMedia,
  bulkDeleteAdsMedia
} = require('../controllers/ads.controller'); // Adjust path as needed
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create-ad/',authMiddleware, createAdsMedia);


router.get('/ads/get', getAllAdsMedia);

router.get('/ads/:id', getAdsMediaById);

router.get('/ads/user/:userId', getAdsMediaByUserId);

router.put('ads/:id', updateAdsMedia);

router.delete('/ads/delete/:id',authMiddleware, deleteAdsMedia);

router.delete('/bulk/delete', bulkDeleteAdsMedia);

module.exports = router;