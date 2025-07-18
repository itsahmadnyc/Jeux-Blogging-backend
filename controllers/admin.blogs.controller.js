const { Blog, User, Category, Like, Comment } = require('../models');
const response = require('../utils/responseHandler');
const { sequelize } = require("../config/database");
const Sequelize = require('sequelize');
const path = require("path");
const { buildCommentTree } = require('../utils/buildCommentTree');
const APP_BASE_URL = process.env.BASE_URL;



exports.globalReadAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { publish: true },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'profileImage'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        }
      ],
      order: [['createdAt', 'DESC']],
    });

    const formattedBlogs = blogs.map(blog => {
      const blogData = blog.toJSON();
      const thumbnailUrl = blogData.thumbnail
        ? `${APP_BASE_URL}/uploads/${blogData.thumbnail}`
        : null;

      return {
        id: blogData.id,
        title: blogData.title,
        blogUrl: blogData.blogUrl,
        content: blogData.content,
        publish: blogData.publish,
        createdAt: blogData.createdAt,
        updatedAt: blogData.updatedAt,
        author: blogData.author,
        category: blogData.category,
        thumbnailUrl: thumbnailUrl
      };
    });

    return response.ok(res, 'All blogs fetched successfully', { blogs: formattedBlogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return response.internalServerError(res, 'Failed to fetch blogs', { error: error.message });
  }
};



exports.getCommentsByBlog = async (req, res) => {
  try {

    const userId = req.user.id;
    if (!userId) {
      return response.notFound(res, "Token is missing or invalid")
    }
    const { blogId } = req.params;
    if (!blogId) {
      return response.badRequest(res, "BlogId is required..!")
    }

    const comments = await Comment.findAll({
      where: {
        blogId,
        parentId: null,
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name', 'email'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return response.ok(res, "Comments with replies fetched successfully", { comments })
  } catch (error) {
    console.error("Error to get comments");
    return response.internalServerError(res, "Failed to get blog comments..!", { error: error.message })
  }
}


exports.deleteBlogComments = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user.id;
    if (!blogId) {
      return response.badRequest(res, "BlogId is required ..");
    }
    if (!userId) {
      return response.notFound(res, "Token is missing or invalid")
    }

    const deleted = await Comment.destroy({ where: { blogId } });

    return response.ok(res, `Deleted comments of blog Id of${blogId}`)
  } catch (error) {
    console.error("Error to delete blog comment");
    return response.internalServerError(res, "Failed to delete Blog Comments", { error: error.message })
  }
}



exports.globalBlogDetailsById = async (req, res) => {
  try {
    const blogUrl = req.params.blogUrl;

    const blog = await Blog.findOne({
      where: { blogUrl: blogUrl },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'profileImage'],
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['type'],
        },
      ],
    });

    if (!blog) {
      return response.notFound(res, "Blog not found.");
    }

    const comments = await Comment.findAll({
      where: { blogId: blog.id }, // Fixed: use blog.id instead of undefined blogId
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    const nestedComments = buildCommentTree(comments);
    const totalComments = comments.length;

    const blogData = blog.toJSON();
    const blogLikes = blogData.likes || [];

    const reactionCounts = {};
    for(const like of blogLikes){
      if(!reactionCounts[like.type]){
        reactionCounts[like.type] = 1;
      }else{
        reactionCounts[like.type]++;
      }
    }

    blogData.reactions = reactionCounts;
    blogData.totalLikes = reactionCounts['👍'] || 0;
    blogData.totalDislikes = reactionCounts['👎'] || 0;

    blogData.thumbnailUrl = blogData.thumbnail
      ? `${APP_BASE_URL}/uploads/${blog.thumbnail}`
      : null;

    blogData.totalComments = totalComments;
    blogData.comments = nestedComments;

    const authorId = blogData.author?.id;
    if(authorId){
      const authorBlogCount = await Blog.count({
        where:{ userId : authorId, publish: true},
      });
      blogData.author.totalBlogs = authorBlogCount;
    }

    return response.ok(res, 'Blog fetched successfully.', { blog: blogData });

  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return response.internalServerError(res, 'Failed to fetch blog.', {
      error: error.message,
    });
  }
};



// 15may code, without emoji in likes
// exports.globalBlogDetailsById = async (req, res) => {
//   try {
//     const blogId = req.params.id;

//     const blog = await Blog.findOne({
//       where: { id: blogId },
//       include: [
//         {
//           model: Category,
//           as: 'category',
//           attributes: ['id', 'name'],
//         },
//         {
//           model: User,
//           as: 'author',
//           attributes: ['id', 'name', 'email', 'profileImage'],
//         },
//         {
//           model: Like,
//           as: 'likes',
//           attributes: ['type']
//         }
//       ],
//     });

//     if (!blog) {
//       return response.notFound(res, "Blog not found.");
//     }
//     const comments = await Comment.findAll({
//       where: { blogId },
//       include: [
//         {
//           model: User,
//           as: 'author',
//           attributes: ['id', 'name', 'email'],
//         },
//       ],
//       order: [['createdAt', 'ASC']],
//     });

//     const nestedComments = buildCommentTree(comments);
//     const totalComments = comments.length;

//     const blogData = blog.toJSON();

//     // Calculate likes and dislikes
//     const blogLikes = blogData.likes || [];
//     blogData.totalLikes = blogLikes.filter(like => like.type === 'like').length;
//     blogData.totalDislikes = blogLikes.filter(like => like.type === 'dislike').length;

//     blogData.thumbnailUrl = blog.thumbnail
//       ? `${APP_BASE_URL}/uploads/${blog.thumbnail}`
//       : null;
//     blogData.totalComments = totalComments;
//     blogData.comments = nestedComments;

//     // Count total blog of author
//     const authorId = blogData.author?.id;
//     if (authorId) {
//       const authorBlogCount = await Blog.count({ where: { userId: authorId, publish: true } });
//       blogData.author.totalBlogs = authorBlogCount;
//     }


//     return response.ok(res, 'Blog fetched successfully.', { blog: blogData });

//   } catch (error) {
//     console.error('Error fetching blog by ID:', error);
//     return response.internalServerError(res, 'Failed to fetch blog.', {
//       error: error.message,
//     });
//   }
// };






exports.getTopFiveBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { publish: true },
      attributes: {
        include: [
          // Total comments
          [Sequelize.literal(`(
            SELECT COUNT(*) FROM comments WHERE comments.blogId = Blog.id
          )`), 'commentCount'],
          // Total likes
          [Sequelize.literal(`(
            SELECT COUNT(*) FROM likes WHERE likes.blogId = Blog.id AND likes.type = 'like'
          )`), 'likeCount']
        ]
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'profileImage']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: [
        [sequelize.literal('commentCount + likeCount'), 'DESC']
      ],
      limit: 5
    });

    blogs.forEach(blog => {
      const commentCount = blog.getDataValue('commentCount');
      const likeCount = blog.getDataValue('likeCount');
      console.log(`Blog ID ${blog.id} - Engagement: ${commentCount + likeCount}`);
    });

    const formatted = blogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      blogUrl: blog.blogUrl,
      content: blog.content,
      publish: blog.publish,
      thumbnail: blog.thumbnail ? `${APP_BASE_URL}/uploads/${path.basename(blog.thumbnail)}` : null,
      commentCount: blog.get('commentCount'),
      likeCount: blog.get('likeCount'),
      author: blog.author,
      category: blog.category,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt
    }));



    return res.status(200).json({
      success: true,
      message: 'Top 5 blogs by comments and likes',
      data: formatted
    });

  } catch (error) {
    console.error("Error to run the code", error);
    return response.internalServerError(res, "Failed to fetch Top 5 posts", { error: error.message })
  }
};









