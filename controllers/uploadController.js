const { MediaFiles } = require("../models");
const AdsMedia = require("../models/AdsMedia");
const response = require("../utils/responseHandler");
const path = require("path");
const fs = require('fs');
const APP_BASE_URL = process.env.BASE_URL;

// Helper function to normalize user ID for comparison
const normalizeUserId = (userId) => {
  if (typeof userId === 'string') {
    const parsed = parseInt(userId);
    return isNaN(parsed) ? userId : parsed;
  }
  return userId;
};

// GENERAL MEDIA FILES FUNCTIONS

// Get all media files for a user
exports.getUserMediaFiles = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Token missing or invalid.' });
    }

    const mediaFiles = await MediaFiles.findAll({
      where: { userId: normalizeUserId(userId) },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: 'User media files fetched successfully.',
      data: mediaFiles
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch user media files.' });
  }
};

// Upload media file
exports.uploadMedia = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return response.notFound(res, 'Token is invalid or missing');
    }

    const uploadedFile = req.file;
    if (!uploadedFile) {
      return response.notFound(res, "No file uploaded.");
    }

    const fileUrl = `${APP_BASE_URL}/uploads/${uploadedFile.filename}`;

    const mediaFile = await MediaFiles.create({
      userId: normalizeUserId(userId),
      fileUrl,
    });

    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        mediaFile
      }
    });
  } catch (error) {
    console.error("Error to file Upload:", error);
    return response.internalServerError(res, "Failed to upload files", { error: error.message });
  }
};

// Delete media file
exports.deleteMediaFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Token missing or invalid.' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Media file ID is required.' });
    }

    const mediaId = parseInt(id);
    if (isNaN(mediaId)) {
      return res.status(400).json({ error: 'Invalid media file ID format.' });
    }

    console.log('Attempting to delete media file:', mediaId);

    // Find the media file
    const media = await MediaFiles.findOne({ where: { id: mediaId } });

    if (!media) {
      console.log('File with ID', mediaId, 'does not exist in database');
      return res.status(404).json({ error: 'Media file not found.' });
    }

    console.log('Media file found:', media.id, 'FileUrl:', media.fileUrl);

    // Extract filename from fileUrl
    const filename = media.fileUrl.split('/').pop();
    
    // Try multiple possible paths
    const possiblePaths = [
      path.join(__dirname, '../uploads', filename),
      path.join(__dirname, '../../uploads', filename),
      path.join(process.cwd(), 'uploads', filename),
      path.join(__dirname, '../public/uploads', filename)
    ];

    console.log('Trying to delete file:', filename);
    console.log('Possible paths:', possiblePaths);

    let fileDeleted = false;
    let filePath = '';

    // Check which path exists and delete
    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath)) {
        filePath = tryPath;
        console.log('File found at:', filePath);
        
        try {
          fs.unlinkSync(filePath);
          fileDeleted = true;
          console.log('File deleted successfully from:', filePath);
          break;
        } catch (unlinkError) {
          console.error('Error deleting file at', filePath, ':', unlinkError);
        }
      }
    }

    if (!fileDeleted) {
      console.warn('Physical file not found at any expected location. Proceeding with database deletion.');
    }

    try {
      // Delete from database regardless of physical file deletion
      await MediaFiles.destroy({ where: { id: mediaId } });
      
      if (fileDeleted) {
        return res.status(200).json({ 
          message: 'File deleted successfully from disk and database.',
          deletedFrom: filePath
        });
      } else {
        return res.status(200).json({ 
          message: 'File deleted from database. Physical file was not found on disk.',
          warning: 'Physical file may have been already deleted or moved.'
        });
      }
    } catch (dbError) {
      console.error('Error deleting from database:', dbError);
      return res.status(500).json({ error: 'Error deleting file from database.' });
    }

  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// ADS MEDIA FILES FUNCTIONS

// Get all ads media files
exports.allAdsMediaFiles = async (req, res) => {
  try {
    const mediaFiles = await AdsMedia.findAll({
      attributes: { exclude: ['userId'] },
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json({
      message: 'Ads media files fetched successfully.',
      data: mediaFiles
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch ads media files.' });
  }
};

// Get ads media files for a specific user
exports.getUserAdsMediaFiles = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Token missing or invalid.' });
    }

    const mediaFiles = await AdsMedia.findAll({
      where: { userId: normalizeUserId(userId) },
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: 'User ads media files fetched successfully.',
      data: mediaFiles
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch user ads media files.' });
  }
};

// Upload ads media with title
exports.uploadMediaWithTitle = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Token is missing or invalid" });
    }

    const { title } = req.body;
    const uploadedFile = req.file;

    if (!uploadedFile) {
      return res.status(400).json({ error: 'File is required.' });
    }

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const fileUrl = `${APP_BASE_URL}/uploads/${uploadedFile.filename}`;
    const fileType = uploadedFile.mimetype;

    const mediaFile = await AdsMedia.create({
      userId: normalizeUserId(userId),
      title,
      fileUrl,
      fileType,
    });

    return res.status(201).json({
      message: 'Ads media file uploaded and saved successfully.',
      data: mediaFile,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Delete ads media file
exports.deleteAdsMediaFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Token missing or invalid.' });
    }

    if (!id) {
      return res.status(400).json({ error: 'Media file ID is required.' });
    }

    const mediaId = parseInt(id);
    if (isNaN(mediaId)) {
      return res.status(400).json({ error: 'Invalid media file ID format.' });
    }

    console.log('Attempting to delete ads media file:', mediaId);

    // Find the media file
    const media = await AdsMedia.findOne({ where: { id: mediaId } });

    if (!media) {
      console.log('Ads file with ID', mediaId, 'does not exist in database');
      return res.status(404).json({ error: 'Ads media file not found.' });
    }

    console.log('Ads media file found:', media.id, 'FileUrl:', media.fileUrl);

    // Extract filename from fileUrl
    const filename = media.fileUrl.split('/').pop();
    
    // Try multiple possible paths
    const possiblePaths = [
      path.join(__dirname, '../uploads', filename),
      path.join(__dirname, '../../uploads', filename),
      path.join(process.cwd(), 'uploads', filename),
      path.join(__dirname, '../public/uploads', filename)
    ];

    console.log('Trying to delete ads file:', filename);
    console.log('Possible paths:', possiblePaths);

    let fileDeleted = false;
    let filePath = '';

    // Check which path exists and delete
    for (const tryPath of possiblePaths) {
      if (fs.existsSync(tryPath)) {
        filePath = tryPath;
        console.log('Ads file found at:', filePath);
        
        try {
          fs.unlinkSync(filePath);
          fileDeleted = true;
          console.log('Ads file deleted successfully from:', filePath);
          break;
        } catch (unlinkError) {
          console.error('Error deleting ads file at', filePath, ':', unlinkError);
        }
      }
    }

    if (!fileDeleted) {
      console.warn('Physical ads file not found at any expected location. Proceeding with database deletion.');
    }

    try {
      // Delete from database regardless of physical file deletion
      await AdsMedia.destroy({ where: { id: mediaId } });
      
      if (fileDeleted) {
        return res.status(200).json({ 
          message: 'Ads media file deleted successfully from disk and database.',
          deletedFrom: filePath
        });
      } else {
        return res.status(200).json({ 
          message: 'Ads media file deleted from database. Physical file was not found on disk.',
          warning: 'Physical file may have been already deleted or moved.'
        });
      }
    } catch (dbError) {
      console.error('Error deleting from database:', dbError);
      return res.status(500).json({ error: 'Error deleting file from database.' });
    }

  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};