const { Blog, User, Comment, Category } = require('../models');
const { buildCommentTree } = require('../utils/buildCommentTree');
const response = require("../utils/responseHandler")








exports.getAllBlogsWithComments = async (req, res) => {
    try {
        const blogs = await Blog.findAll({
            attributes: ['id', 'title'],
            order: [['createdAt', 'DESC']],
        });

        if (!blogs.length) {
            return res.status(404).json({ message: 'No blogs found.' });
        }

        const allComments = await Comment.findAll({
            include: [
                {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email'],
                },
            ],
            order: [['createdAt', 'ASC']],
        });

        // Group comments by blogId
        const blogCommentsMap = {};
        allComments.forEach(comment => {
            const blogId = comment.blogId;
            if (!blogCommentsMap[blogId]) {
                blogCommentsMap[blogId] = [];
            }
            blogCommentsMap[blogId].push(comment);
        });

        const responseData = blogs.map(blog => {
            const blogComments = blogCommentsMap[blog.id] || [];
            const nestedComments = buildCommentTree(blogComments);

            return {
                id: blog.id,
                title: blog.title,
                comments: nestedComments,
            };
        });

        return res.status(200).json({
            message: 'Blogs with comments fetched successfully.',
            data: responseData,
        });
    } catch (error) {
        console.error('Error fetching blogs with comments:', error);
        return res.status(500).json({
            error: 'Internal server error.',
        });
    }
};



exports.deleteComment = async (req, res) => {
    try {

        const userId = req.user.id;
        const { commentId } = req.params;

        if (!userId) {
            return response.unauthorized(res, "Token is missing or invalid")
        }

        const comment = await Comment.findOne({
            where:{
                id: commentId
            }
        });

        if(!comment){
            return response.notFound(res, "Comment not found")
        }

        await comment.destroy();

        return response.ok(res, "Comment deleted successfully");


    } catch (error) {
        console.error("Error to delete the comment");
        return response.internalServerError(res, "Failed to delete the comment")
    }
}



