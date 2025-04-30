const User = require('./User');
const Blog = require('./Blog');
const Category = require('./Category');
const Like = require('./Like');
const Comment = require('./Comment');
const UserVisit = require('./UserVisit');
const MediaFiles = require('./MediaFiles'); 



const associate = require('./association');
associate({ models: { User, Blog, Category, Like, Comment, UserVisit, MediaFiles } });


module.exports = {User, Blog, Category, Like, Comment, UserVisit, MediaFiles };
