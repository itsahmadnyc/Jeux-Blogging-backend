const { Blog, User, Category, Like, Comment } = require('../models');
const response = require('../utils/responseHandler');
const { buildCommentTree } = require('../utils/buildCommentTree'); // Make sure this utility exists


const APP_BASE_URL = process.env.BASE_URL;



exports.adminReadAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            where: { publish: true },
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
        const {blogId} = req.params;
        const userId = req.user.id;
if(!blogId){
    return response.badRequest(res, "BlogId is required ..")
}
if(!userId){
    return response.notFound(res, "Token is missing or invalid")
}

const deleted = await Comment.destroy({where: {blogId}});

return response.ok(res, `Deleted comments of blog Id of${blogId}`)
    } catch (error) {
        console.error("Error to delete blog comment");
        return response.internalServerError(res, "Failed to delete Blog Comments", { error: error.message })
    }
}





exports.globalGetBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return response.notFound(res, "Token is missing or invalid");
    }

    const blog = await Blog.findOne({
      where: { id: blogId },
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

    if (!blog) {
      return response.notFound(res, "Blog not found.");
    }

    const comments = await Comment.findAll({
      where: { blogId },
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

