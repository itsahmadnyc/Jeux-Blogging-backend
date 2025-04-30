const { User, Blog, Category, Comment, Like } = require('../models');
const Subscriber = require('../models/Subscriber');
const { sendEmail } = require('../services/emailService');
const response = require('../utils/responseHandler');
const { Op } = require("sequelize");




exports.createBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, blogAuthor, content, categoryId, tags, publish = false } = req.body;

    if (!title || !content || !categoryId) {
      return response.badRequest(res, 'Title, content and categoryId are required.');
    }

    // Optional: Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return response.badRequest(res, 'Invalid categoryId. Category not found.');
    }

    const newBlog = await Blog.create({
      title,
      blogAuthor: blogAuthor || req.user.name,
      content,
      categoryId,
      userId,
      publish,
      tags,
    });

    if (publish === true || publish === 1){
      const subscribers = await Subscriber.findAll();
      const users = await User.findAll({where: {role: 'user'}});

      const allEmails = [
        ...subscribers.map(s => s.email),
        ...users.map(u => u.email)
      ];

      const subject = `New Blog pulished: ${title}`
      const message = `Hi,\n\nA new blog titled "${title}" has been published on Jeux.\n\nVisit our site to read it.\n\nBest,\nJeux developer Team`;
    

    for(const email of allEmails){
      await sendEmail(email, subject, message)
    }
  }

    const msg = publish ? 'Blog published successfully' : 'Blog saved as draft';
    return response.created(res, msg, { blog: newBlog });

  } catch (error) {
    console.error('Error creating blog:', error);
    return response.internalServerError(res, 'Failed to create blog.', { error: error.message });
  }
};



exports.employeePublishedBlogs = async (req, res) => {
  try {
    const userId = req.user.id;

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

    return response.ok(res, 'Published blogs fetched successfully.', { blogs: publishedBlogs });
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    return response.internalServerError(res, 'Failed to fetch published blogs.', { error: error.message });
  }
};



exports.employeeDraftBlogs = async (req, res) => {
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

    return response.ok(res, 'Draft blogs fetched successfully.', { blogs: draftBlogs });

  } catch (error) {
    console.error('Error fetching draft blogs:', error);
    return response.internalServerError(res, "Failed to fetch draft blogs..!", {error: error.message})
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


exports.employeeStats = async (req, res) => {
  try {
    const userId = req.params.id;
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
    if(!userId){
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

    await blog.destroy();
    return response.ok(res, "Employee account has been deleted successfully..!")

  } catch (error) {
    console.log('Error of delete blog');
    return response.internalServerError(res, "Failed to delete the employee blog", { error: error.message });
  }
}

