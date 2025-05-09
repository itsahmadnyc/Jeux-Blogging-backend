const { User, Blog, Comment, Like, Category, UserVisit } = require("../models");
const response = require('../utils/responseHandler');
const { Op } = require("sequelize");
const path = require('path');

const APP_BASE_URL = process.env.BASE_URL;




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
    return response.internalServerError(res, 'Failed to fetch admin stats', { error: error.message });
  }
};



exports.adminGetEmpDetailsById = async (req, res) => {
  try {
    const adminId = req.user.id;

    if (!adminId) {
      return response.notFound(res, "AdminId is missing or invalid")
    }

    const employeeId = req.params.id;


    // 1. Find the employee by ID and role
    const employee = await User.findOne({
      where: { id: employeeId },
      attributes: ['id', 'name', 'email', 'profileImage', 'createdAt'],
    });

    if (!employee) {
      return response.notFound(res, 'Employee not found');
    }


    const blogs = await Blog.findAll({
      where: { userId: employeeId,  publish: true, },
      attributes: ['id', 'title', 'content', 'thumbnail', 'publish', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name'],
        },
        {
          model: Comment,
          as: 'comments',
          attributes: ['id', 'content']
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['type'],
        }
      ]
    });

    const blogIds = blogs.map(blog => blog.id);


    const totalBlogs = blogs.length;


    const totalPublishedBlogs = blogs.filter(blog => blog.publish === true).length;
    // const totalDraftBlogs = blogs.filter(blog => blog.publish === false).length;


    const comments = await Comment.findAll({
      where: { blogId: blogIds.length > 0 ? blogIds : null },
      attributes: ['id'],
    });

    const totalComments = comments.length;


    const likes = await Like.findAll({
      where: { blogId: blogIds.length > 0 ? blogIds : null },
      attributes: ['type'],
    });

    const totalLikeComments = likes.filter(like => like.type === 'like').length;
    const totalUnLikeComments = likes.filter(like => like.type === 'dislike').length;


    const formattedBlogs = blogs.map(blog => {
      const blogData = blog.toJSON();
      
      const blogLikes = blogData.likes || [];


      const totalLikes = blogLikes.filter(l => l.type === 'like').length;
      const totalDislikes = blogLikes.filter(l => l.type === 'dislike').length;

      // Count comments
      const blogComments = blogData.comments || [];
      const totalComments = blogComments.length;


      blogData.thumbnail = blogData.thumbnail ? `${APP_BASE_URL}/uploads/${path.basename(blogData.thumbnail)}` : null;



      blogData.totalLikes = totalLikes;
      blogData.totalDislikes = totalDislikes;
      blogData.totalComments = totalComments;

      return blogData;
    });


    return response.ok(res, 'Employee details fetched successfully', {
      employee,
      totalBlogs,
      totalPublishedBlogs,
      // totalDraftBlogs,
      totalComments,
      totalLikeComments,
      totalUnLikeComments,
      blogs: formattedBlogs,
    });

  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    return response.internalServerError(res, 'Failed to fetch employee details', {
      error: error.message,
    });
  }
};
