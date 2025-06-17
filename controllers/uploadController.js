const { MediaFiles,  } = require("../models");
const response = require("../utils/responseHandler");
const path = require("path")
const APP_BASE_URL = process.env.BASE_URL;
const fs = require('fs');
const AdsMedia = require("../models/AdsMedia");







exports.allMediaFiles = async (req, res) => {
  try {
   
    
    
    
    const mediaFiles = await AdsMedia.findAll({
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      message: 'Media files fetched successfully.',
      data: mediaFiles
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch media files.' });
  }
};





exports.uploadMedia = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return response.notFound(res, 'Token is invalid or missing');
  }

  const uploadedFile = req.file;

  if (!uploadedFile) {
    return response.notFound(res, "No file uploaded.");
  }
  // const pathParts = req.file.destination.split(path.sep);
  // const folderName = pathParts[pathParts.length - 1];

  const fileUrl = `${APP_BASE_URL}/uploads/${uploadedFile.filename}`;

  try {
    const mediaFile = await MediaFiles.create({
      userId,
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
      userId,
      title,
      fileUrl,
      fileType,
    });

    return res.status(201).json({
      message: 'File uploaded and saved successfully.',
      data: mediaFile,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Something went wrong.' });
  }
};





exports.deleteMediaFile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Token missing or invalid.' });
    }

    
    const media = await MediaFiles.findOne({ where: { id, userId } });

    if (!media) {
      return res.status(404).json({ error: 'Media file not found or not owned by user.' });
    }

    // Extract filename from fileUrl
    const filename = media.fileUrl.split('/').pop();
    const filePath = path.join(__dirname, '../uploads', filename);

    // Delete physical file
    fs.unlink(filePath, async (err) => {
      if (err && err.code !== 'ENOENT') {
        return res.status(500).json({ error: 'Error deleting file from disk.' });
      }

     
      await MediaFiles.destroy({ where: { id } });

      return res.status(200).json({ message: 'File deleted successfully from disk and database.' });
    });

  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};







