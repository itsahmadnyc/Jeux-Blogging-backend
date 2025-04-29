const { Blog, User, Category, Like } = require('../models');
const response = require('../utils/responseHandler');

exports.adminReadAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        {
          model: User,
           as: 'author',
          attributes: ['id', 'name', 'email'],
         
        },
        {
          model: Category,
             as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: Like,
          as: 'likes',
          attributes: ['type'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Enhance each blog with like/dislike counts
    const formattedBlogs = blogs.map(blog => {
      const likes = blog.Likes?.filter(like => like.type === 'like').length || 0;
      const dislikes = blog.Likes?.filter(like => like.type === 'dislike').length || 0;

      return {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        publish: blog.publish,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        author: blog.User,
        category: blog.Category,
        likes,
        dislikes,
      };
    });

    return response.ok(res, 'All blogs fetched successfully', { blogs: formattedBlogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return response.internalServerError(res, 'Failed to fetch blogs', { error: error.message });
  }
};
