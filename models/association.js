
module.exports = (sequelize) => {
    const { User, Blog, Comment, Category, Like, UserVisit } = sequelize.models;

    //User → Blogs
    User.hasMany(Blog, {
        foreignKey: 'userId',
        as: 'blogs',
    });
    Blog.belongsTo(User, {
        foreignKey: 'userId',
        as: 'author'
    });


    // User → Comments
    User.hasMany(Comment, {
        foreignKey: 'userId',
        as: 'comments'
    });
    Comment.belongsTo(User, {
        foreignKey: 'userId',
        as: 'author'
    });


    //User → Likes
    User.hasMany(Like, {
        foreignKey: 'userId',
        as: 'likes'
    });
    Like.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    })


    //Blogs → Likes
    Blog.hasMany(Like, {
        foreignKey: 'blogId',
        as: 'likes'
    });

    Like.belongsTo(Blog, {
        foreignKey: 'blogId',
        as: 'blog'
    });

    // Blogs → Comments
    Blog.hasMany(Comment, {
        foreignKey: 'blogId',
        as: 'comments',
        constraints: false ,
    },
);


    Comment.belongsTo(Blog, {
        foreignKey: 'blogId',
        as: 'blog', 
        constraints: false ,
    });

    // User → Category
    User.hasMany(Category, {
        foreignKey: 'userId',
        as: 'categories'
    });
    Category.belongsTo(User, {
        foreignKey: 'userId',
        as: 'creator'
    })


    // Category → Blogs
    Category.hasMany(Blog, {
        foreignKey: 'categoryId',
        as: 'blogs',
    });
    Blog.belongsTo(Category, {
        foreignKey: 'categoryId',
        as: 'category'
    });

    // For Nested Comment associations
    Comment.belongsTo(Comment, {
        as: 'parent',
        foreignKey: 'parentId',
        onDelete: 'CASCADE',
    });
    Comment.hasMany(Comment, {
        as: 'replies',
        foreignKey: 'parentId',
        onDelete: 'CASCADE',
    });

    
    UserVisit.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user'
    });


}