const {AdsMedia} = require('../models/index'); // Adjust path as needed
const mediaUploadHandler = require('../middlewares/mediaUploadHandler'); // Adjust path as needed
const path = require('path');
const fs = require('fs');
const APP_BASE_URL = process.env.BASE_URL;

// Helper function to delete file from filesystem
const deleteFile = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

// Helper function to get full file path
const getFilePath = (fileUrl) => {
  if (!fileUrl) return null;
  return path.join(__dirname, '../uploads', path.basename(fileUrl));
};

// Create new ads media with file upload
const createAdsMedia = async (req, res) => {
  try {
    // Handle file upload first
    mediaUploadHandler(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
      }

      const {  title } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!userId) {
        // Delete uploaded file if validation fails
        if (req.file) {
          deleteFile(req.file.path);
        }
        return res.status(400).json({
          success: false,
          message: 'userId is required'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'File is required'
        });
      }

      try {
        // Create file URL (you might want to adjust this based on your server setup)
        const fileUrl = `${APP_BASE_URL}/uploads/${req.file.filename}`;

        const adsMedia = await AdsMedia.create({
          userId: parseInt(userId),
          fileUrl,
          title: title || null
        });

        res.status(201).json({
          success: true,
          message: 'Ads media created successfully',
          data: adsMedia
        });

      } catch (dbError) {
        // Delete uploaded file if database operation fails
        if (req.file) {
          deleteFile(req.file.path);
        }
        
        res.status(500).json({
          success: false,
          message: 'Database error',
          error: dbError.message
        });
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all ads media with optional filtering
const getAllAdsMedia = async (req, res) => {
  try {
    const { userId } = req.query;
    
    const whereClause = userId ? { userId: parseInt(userId) } : {};

    const adsMedia = await AdsMedia.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'Ads media retrieved successfully',
      data: adsMedia
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get single ads media by ID
const getAdsMediaById = async (req, res) => {
  try {
    const { id } = req.params;

    const adsMedia = await AdsMedia.findByPk(id);

    if (!adsMedia) {
      return res.status(404).json({
        success: false,
        message: 'Ads media not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ads media retrieved successfully',
      data: adsMedia
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get ads media by user ID
const getAdsMediaByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const adsMedia = await AdsMedia.findAll({
      where: { userId: parseInt(userId) },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      message: 'User ads media retrieved successfully',
      data: adsMedia
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update ads media (with optional file replacement)
const updateAdsMedia = async (req, res) => {
  try {
    const { id } = req.params;

    // Find existing record
    const existingAdsMedia = await AdsMedia.findByPk(id);
    if (!existingAdsMedia) {
      return res.status(404).json({
        success: false,
        message: 'Ads media not found'
      });
    }

    // Handle file upload if new file is provided
    mediaUploadHandler(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: 'File upload error',
          error: err.message
        });
      }

      try {
        const { title } = req.body;
        const updateData = {};

        // Update title if provided
        if (title !== undefined) {
          updateData.title = title;
        }

        // Handle file replacement
        if (req.file) {
          // Delete old file
          const oldFilePath = getFilePath(existingAdsMedia.fileUrl);
          if (oldFilePath) {
            deleteFile(oldFilePath);
          }

          // Set new file URL
          updateData.fileUrl = `/uploads/${req.file.filename}`;
        }

        // Update the record
        await existingAdsMedia.update(updateData);

        res.status(200).json({
          success: true,
          message: 'Ads media updated successfully',
          data: existingAdsMedia
        });

      } catch (dbError) {
        // If database update fails and we uploaded a new file, delete it
        if (req.file) {
          deleteFile(req.file.path);
        }

        res.status(500).json({
          success: false,
          message: 'Database error',
          error: dbError.message
        });
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Delete ads media
const deleteAdsMedia = async (req, res) => {
  try {
    const { id } = req.params;

    const adsMedia = await AdsMedia.findByPk(id);
    if (!adsMedia) {
      return res.status(404).json({
        success: false,
        message: 'Ads media not found'
      });
    }

    // Delete associated file
    const filePath = getFilePath(adsMedia.fileUrl);
    if (filePath) {
      deleteFile(filePath);
    }

    // Delete database record
    await adsMedia.destroy();

    res.status(200).json({
      success: true,
      message: 'Ads media deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Bulk delete ads media
const bulkDeleteAdsMedia = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'IDs array is required'
      });
    }

    // Find all records to delete
    const adsMediaRecords = await AdsMedia.findAll({
      where: { id: ids }
    });

    if (adsMediaRecords.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No ads media found with provided IDs'
      });
    }

    // Delete associated files
    adsMediaRecords.forEach(record => {
      const filePath = getFilePath(record.fileUrl);
      if (filePath) {
        deleteFile(filePath);
      }
    });

    // Delete database records
    const deletedCount = await AdsMedia.destroy({
      where: { id: ids }
    });

    res.status(200).json({
      success: true,
      message: `${deletedCount} ads media deleted successfully`,
      deletedCount
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createAdsMedia,
  getAllAdsMedia,
  getAdsMediaById,
  getAdsMediaByUserId,
  updateAdsMedia,
  deleteAdsMedia,
  bulkDeleteAdsMedia
};