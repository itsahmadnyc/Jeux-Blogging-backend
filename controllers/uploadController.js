const { MediaFiles } = require("../models");
const response = require("../utils/responseHandler");
const APP_BASE_URL = process.env.BASE_URL;






exports.uploadMedia = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return response.notFound(res, 'Token is invalid or missing');
  }

  const uploadedFile = req.file;

  if (!uploadedFile) {
    return response.notFound(res, "No file uploaded.");
  }

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








