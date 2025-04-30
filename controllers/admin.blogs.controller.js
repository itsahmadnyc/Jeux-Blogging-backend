const { Blog, User, Category, Like, Comment } = require('../models');
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
                }
            ],
            order: [['createdAt', 'DESC']],
        });

        const formattedBlogs = blogs.map(blog => ({
            id: blog.id,
            title: blog.title,
            content: blog.content,
            publish: blog.publish,
            createdAt: blog.createdAt,
            updatedAt: blog.updatedAt,
            author: blog.author,
            category: blog.category,
        }));

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
