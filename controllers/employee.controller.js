const { User, Blog, Category, Comment, Like } = require('../models');
const Subscriber = require('../models/Subscriber');
const { buildCommentTree } = require('../utils/buildCommentTree');
const notifyAllSubscribersAndUsers = require("../utils/notifyAllsubscriberfun.js")
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
      publish,
      blogUrl
    } = req.body;

    if (!title || !content || !categoryId || !blogUrl) {
      return response.badRequest(res, 'Title, content, blogUrl and categoryId are required.');
    }

    // Check if blogUrl already exists
    const existingBlog = await Blog.findOne({ where: { blogUrl } });
    if (existingBlog) {
      return response.badRequest(res, 'Blog URL already exists. Please use a different URL.');
    }

    const category = await Category.findByPk(categoryId);
    if (!category) {
      return response.badRequest(res, 'Invalid categoryId. Category not found.');
    }

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
      blogUrl
    });

    const publishFlag = publish === 'true' || publish === true || publish === 1 || publish === '1';
    if (publishFlag) {
      await notifyAllSubscribersAndUsers(newBlog.title);
    }

    const blogData = {
      ...newBlog.toJSON(),
      thumbnailUrl,
    };

    const message = publish ? 'Blog published successfully. ' : 'Blog saved as draft';
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

    if (!userId) {
      return response.notFound(res, "Token is missing or invalid")
    }

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

    const user = await User.findByPk(userId);

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

    if (!draftBlogs || draftBlogs.length === 0) {
      return response.notFound(res, "Draft blogs are not found..!");
    }

    const blogsWithUrl = draftBlogs.map(blog => {
      const blogData = blog.toJSON();
      blogData.thumbnailUrl = blog.thumbnail
        ? `${APP_BASE_URL}/uploads/${blog.thumbnail}`
        : null;
      return blogData;
    });

    return response.ok(res, 'Draft blogs fetched successfully.', {
      authUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
          ? user.profileImage.startsWith("http")
            ? user.profileImage
            : `${APP_BASE_URL}/uploads/${user.profileImage}`
          : null,
        
      },
      blogs: blogsWithUrl
    });

  } catch (error) {
    console.error('Error fetching draft blogs:', error);
    return response.internalServerError(res, "Failed to fetch draft blogs..!", {
      error: error.message
    });
  }
};




// exports.empDraftBlogs = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const draftBlogs = await Blog.findAll({
//       where: {
//         userId: userId,
//         publish: false
//       },
//       include: [
//         {
//           model: Category,
//           as: 'category',
//           attributes: ['id', 'name']
//         }
//       ],
//       order: [['createdAt', 'DESC']]
//     });

//     if (!draftBlogs) {
//       return response.notFound(res, "Draft blogs are not found..!")
//     }

//     const blogsWithUrl = draftBlogs.map(blog => {
//       const blogData = blog.toJSON();
//       blogData.thumbnailUrl = blog.thumbnail
//         ? `${APP_BASE_URL}/uploads/${blog.thumbnail}`
//         : null;
//       return blogData;
//     });

//     return response.ok(res, 'Draft blogs fetched successfully.', { blogs: blogsWithUrl });

//   } catch (error) {
//     console.error('Error fetching draft blogs:', error);
//     return response.internalServerError(res, "Failed to fetch draft blogs..!", { error: error.message })
//   }
// };


exports.updateEmployeeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;
    const {
      title,
      blogAuthor,
      content,
      categoryId,
      tags,
      publish,
      blogUrl
    } = req.body;

    const blog = await Blog.findOne({ where: { id: blogId, userId } });

    if (!blog) {
      return response.notFound(res, 'Blog not found or not authorized to update.');
    }

    if (blogUrl && blogUrl !== blog.blogUrl) {
      const existingBlog = await Blog.findOne({ 
        where: { 
          blogUrl,
          id: { [Op.ne]: blogId } 
        } 
      });
      if (existingBlog) {
        return response.badRequest(res, 'Blog URL already exists. Please use a different URL.');
      }
    }

    const parsedCategoryId = categoryId ? parseInt(categoryId) : blog.categoryId;
    const publishFlag = publish === 'true' || publish === true || publish === 1 || publish === '1';

    if (parsedCategoryId !== blog.categoryId) {
      const category = await Category.findByPk(parsedCategoryId);
      if (!category) {
        return response.badRequest(res, 'Invalid categoryId. Category not found.');
      }
    }

    let thumbnail = blog.thumbnail;
    if (req.file) {
      thumbnail = req.file.filename;
    }

    // CHECK CHANGE, TO UNPUBLISHED TO PUBLISHED
    const wasUnpublished = blog.publish === false;
    const isNowPublished = publishFlag === true;

    await blog.update({
      title: title || blog.title,
      blogAuthor: blogAuthor || blog.blogAuthor,
      content: content || blog.content,
      categoryId: parsedCategoryId,
      publish: publishFlag,
      tags: tags || blog.tags,
      thumbnail,
      blogUrl: blogUrl || blog.blogUrl
    });

    // SEND NOTIFICATION IF BLOG IS NEWELY PUBLISHED
    if (wasUnpublished && isNowPublished) {
      await notifyAllSubscribersAndUsers(blog.title);
    }

    const blogData = blog.toJSON();
    blogData.thumbnailUrl = thumbnail ? `${APP_BASE_URL}/uploads/${thumbnail}` : null;

    return response.ok(res, 'Blog updated successfully. On new publish blog notification send to Users and Subscribers', { blog: blogData });

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


    return response.ok(res, 'Employee Status records are', {
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
    return response.ok(res, "Employee has deleted own blog successfully..!", { deletedBlog });

  } catch (error) {
    console.log('Error of delete blog');
    return response.internalServerError(res, "Failed to delete the employee blog", { error: error.message });
  }
}




exports.empGetBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return response.notFound(res, "Token is missing or inValid");
    }


    console.log("blogId and userId", blogId, userId)


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
          attributes: ['id', 'name', 'email', 'profileImage'],
        },
      ],
    });


    if (!blog) {
      return response.notFound(res, "Blog not found or you're not authorized to view it.");
    }

    const comments = await Comment.findAll({
      where: { blogId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'ASC']],
    });




    const nestedComments = buildCommentTree(comments);

    const totalComments = comments.length;


    const blogData = blog.toJSON();
    blogData.thumbnailUrl = blog.thumbnail
      ? `${APP_BASE_URL}/uploads/${blog.thumbnail}`
      : null;
    blogData.totalComments = totalComments;
    blogData.comments = nestedComments;


    return response.ok(res, 'Blog fetched successfully.', { blog: blogData });

  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    return response.internalServerError(res, 'Failed to fetch blog.', {
      error: error.message,
    });
  }
};













