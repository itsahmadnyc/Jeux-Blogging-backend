const { User, Comment, Like, UserVisit } = require("../models");
const response = require('../utils/responseHandler');

exports.adminStats = async (req, res) => {
  try {
   
    const totalEmployees = await User.count({
      where: { role: 'employee' }
    });

    const totalComments = await Comment.count();

    const totalUserVisits = await UserVisit.count();

    const totalLikes = await Like.count({
      where: { type: 'like' }
    });

    return res.status(200).json({
      success: true,
      message: 'Admin Stats fetched successfully',
      data: {
        totalEmployees,
        totalComments,
        totalUserVisits,
        totalLikes
      }
    });

  } catch (error) {
    console.error('Error fetching Admin Stats:', error);
    return response.internalServerError(res, 'Failed to fetch admin stats', {error: error.message});
  }
};
