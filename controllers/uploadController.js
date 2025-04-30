const { MediaFiles } = require("../models");
const response = require("../utils/responseHandler");
const APP_BASE_URL = process.env.BASE_URL;

exports.uploadMedia = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return response.notFound(res, 'Tokin is invalid or missing');
  }
  const uploadedFile = req.file;


  if (!uploadedFile) {
    return response.notFound(res, "No file uploaded.");
  }

  const fileUrl = `${APP_BASE_URL}/uploads/${uploadedFile.filename}`;

  try {
    const mediaFiles = await MediaFiles.create({
      userId,
      fileUrl,

    })
    res.status(200).json({
      message: 'File uploaded successfully',
      data:{
        fileUrl
      }
    });
  } catch (error) {
    console.error("Error to file Upload");
    return response.internalServerError(res, "Failed to Upload files")
  }

};



