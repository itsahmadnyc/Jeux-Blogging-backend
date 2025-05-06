const { User, Blog, Category, Comment, Like } = require('../models');
const Subscriber = require('../models/Subscriber');
const notifyAllSubscribersAndUsers = require('../utils/notifyAllsubscriberfun');
const response = require('../utils/responseHandler');
const { Op } = require("sequelize");
const APP_BASE_URL = process.env.BASE_URL;





exports.createBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      blogAuthor,
      content,
      categoryId,
      tags,
      publish = false,
    } = req.body;

    if (!title || !content || !categoryId) {
      return response.badRequest(res, 'Title, content, and categoryId are required.');
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return response.badRequest(res, 'Invalid categoryId. Category not found.');
    }

    // Handle thumbnail upload
    let thumbnail = null;
    let thumbnailUrl = null;
    if (req.file) {
      thumbnail = req.file.filename;
      thumbnailUrl = `${APP_BASE_URL}/uploads/${thumbnail}`;
    }

    const newBlog = await Blog.create({
      title,
      blogAuthor: blogAuthor || req.user.name,
      content,
      categoryId,
      userId,
      publish,
      tags,
      thumbnail,
    });


    if (publish === true || publish === 1) {
      await notifyAllSubscribersAndUsers(newBlog.title);
    }

    const blogData = {
      ...newBlog.toJSON(),
      thumbnailUrl,
    };

    const message = publish ? 'Blog published successfully' : 'Blog saved as draft';
    return response.created(res, message, { blog: blogData });

  } catch (error) {
    console.error('Error creating blog:', error);
    return response.internalServerError(res, 'Failed to create blog.', {
      error: error.message,
    });
  }
};



exports.empPublishedBlogs = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("User Is in Published Controller", userId)

    const publishedBlogs = await Blog.findAll({
      where: {
        userId,
        publish: true,
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    if (!publishedBlogs) {
      return response.notFound(res, "No published Blogs Found")
    }


    const blogsWithUrl = publishedBlogs.map(blog => {
      const blogData = blog.toJSON();
      blogData.thumbnailUrl = blog.thumbnail
        ? `${APP_BASE_URL}/uploads/${blog.thumbnail}`
        : null;
      return blogData;
    })

    return response.ok(res, 'Published blogs fetched successfully.', { blogs: blogsWithUrl });
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    return response.internalServerError(res, 'Failed to fetch published blogs.', { error: error.message });
  }
};



exports.empDraftBlogs = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("UserId is in Employee Draft Blogs:", userId);
    const draftBlogs = await Blog.findAll({
      where: {
        userId: userId,
        publish: false
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    if (!draftBlogs) {
      return response.notFound(res, "Draft blogs are not found..!")
    }

    const blogsWithUrl = draftBlogs.map(blog => {
      const blogData = blog.toJSON();
      blogData.thumbnailUrl = blog.thumbnail
        ? `${APP_BASE_URL}/uploads/${blog.thumbnail}`
        : null;
      return blogData;
    });


    return response.ok(res, 'Draft blogs fetched successfully.', { blogs: blogsWithUrl });

  } catch (error) {
    console.error('Error fetching draft blogs:', error);
    return response.internalServerError(res, "Failed to fetch draft blogs..!", { error: error.message })
  }
};


exports.updateEmployeeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const { title, content, categoryId, publish, tags } = req.body;

    const blog = await Blog.findOne({ where: { id: blogId, userId } });

    if (!blog) {
      return response.notFound(res, 'Blog not found or not authorized to update.');
    }

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return response.badRequest(res, 'Invalid categoryId. Category not found.');
      }
    }


    await blog.update({
      title: title || blog.title,
      content: content || blog.content,
      categoryId: categoryId || blog.categoryId,
      publish: typeof publish === 'boolean' ? publish : blog.publish,
      tags: tags || blog.tags,
    });

    return response.ok(res, 'Blog updated successfully.', { blog });

  } catch (error) {
    console.error('Error updating blog:', error);
    return response.internalServerError(res, 'Failed to update blog.', { error: error.message });
  }
};


exports.employeeStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return response.notFound(res, 'Token is missing or invalid..!')
    }

    const blogs = await Blog.findAll({
      where: { userId },
      attributes: ['id', 'publish',]
    });

    const totalBlogs = blogs.length;
    const publishedBlogs = blogs.filter(blog => blog.publish).length;
    const draftBlogs = blogs.filter(blog => !blog.publish).length;


    const blogIds = blogs.map(blog => blog.id);



    const totalComments = await Comment.count({
      where: { blogId: { [Op.in]: blogIds } },
    });


    const likesCount = await Like.count({
      where: {
        blogId: { [Op.in]: blogIds },
        type: 'like',
      },
    });


    const dislikeCount = await Like.count({
      where: {
        blogId: { [Op.in]: blogIds },
        type: 'dislike'
      },
    });


    return response.ok(res, 'Employee Stats records are', {
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalComments,
      likesCount,
      dislikeCount
    })


  } catch (error) {
    console.log("Error to get Employee stats");
    return response.internalServerError(res, "Failed to fetch Employee status", { error: error.message });
  }
}


exports.empDeleteOwnBlog = async (req, res) => {
  try {

    const { blogId } = req.params;
    const userId = req.user.id;
    if (!userId) {
      return response.notFound(res, "Token is missing or invalid..!")
    }


    const blog = await Blog.findOne({
      where: {
        id: blogId,
        userId: userId
      }
    });

    if (!blog) {
      return response.notFound(res, "Blog not found or you do not have permission to delete this blog.")
    }

    const deletedBlog = await blog.destroy();
    return response.ok(res, "Employee has been deleted own blog successfully..!", { deletedBlog });

  } catch (error) {
    console.log('Error of delete blog');
    return response.internalServerError(res, "Failed to delete the employee blog", { error: error.message });
  }
}




exports.empGetBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    const blog = await Blog.findOne({
      where: {
        id: blogId,
        userId,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: Comment,
          as: 'comments',
          where: { parentId: null },
          required: false,
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
        },
      ],
    });

    if (!blog) {
      return response.notFound(res, "Blog not found or you're not authorized to view it.");
    }

    const totalComments = await Comment.count({ where: { blogId } });

    const APP_BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
    const blogData = blog.toJSON();
    blogData.thumbnailUrl = blog.thumbnail
      ? `${APP_BASE_URL}/uploads/${blog.thumbnail}`
      : null;
    blogData.totalComments = totalComments;

    return response.ok(res, 'Blog fetched successfully.', { blog: blogData });

  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return response.internalServerError(res, 'Failed to fetch blog.', {
      error: error.message,
    });
  }
};





// exports.empGetBlogById = async (req, res) => {
//   try {
//     const blogId = req.params.id;
//     const userId = req.user.id;

//     const blog = await Blog.findOne({
//       where: {
//         id: blogId,
//         userId, // ensure employee can only fetch their own blog
//       },
//       include: [
//         {
//           model: Category,
//           as: 'category',
//           attributes: ['id', 'name'],
//         },
//         {
//           model: User,
//           as: 'author',
//           attributes: ['id', 'name', 'email'],
//         },
//         {
//           model: Comment,
//           as: 'comments',
//           attributes: ['id', 'content', 'userId', 'blogId', 'parentId', 'createdAt'],
//           include: [
//             {
//               model: User,
//               as: 'author',
//               attributes: ['id', 'name', 'email'],
//             },
//           ],
//         },
//       ],
//     });

//     if (!blog) {
//       return response.notFound(res, "Blog not found or you are not authorized to view it.");
//     }

//     const APP_BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

//     const blogData = blog.toJSON();
//     blogData.thumbnailUrl = blog.thumbnail
//       ? `${APP_BASE_URL}/uploads/${blog.thumbnail}`
//       : null;

//     return response.ok(res, 'Blog fetched successfully.', { blog: blogData });

//   } catch (error) {
//     console.error('Error fetching blog by ID:', error);
//     return response.internalServerError(res, 'Failed to fetch blog.', {
//       error: error.message,
//     });
//   }
// };
