const User = require('./User');
const Blog = require('./Blog');
const Category = require('./Category');
const Like = require('./Like');
const Comment = require('./Comment');



const associate = require('./association');
associate({ models: { User, Blog, Category, Like, Comment } });


module.exports = {User, Blog, Category, Like, Comment};
