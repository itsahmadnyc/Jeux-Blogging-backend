
module.exports = (sequelize) => {
    const { User, Blog, Comment, Category, Like, UserVisit, MediaFiles, ContactUs } = sequelize.models;

    //User → Blogs
    User.hasMany(Blog, {
        foreignKey: 'userId',
        as: 'blogs',
        onDelete: 'CASCADE',
    });
    Blog.belongsTo(User, {
        foreignKey: 'userId',
        as: 'author'
    });


    // User → Comments
    User.hasMany(Comment, {
        foreignKey: 'userId',
        as: 'comments',
        onDelete: 'CASCADE',
    });

    Comment.belongsTo(User, {
        foreignKey: 'userId',
        as: 'author'
    });


    //User → Likes
    User.hasMany(Like, {
        foreignKey: 'userId',
        as: 'likes',
        onDelete: 'CASCADE',
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
        constraints: false,
        onDelete: 'CASCADE',
    },
    );


    Comment.belongsTo(Blog, {
        foreignKey: 'blogId',
        as: 'blog',
        onDelete: 'CASCADE',
        constraints: false,
    });

    // User → Category
    User.hasMany(Category, {
        foreignKey: 'userId',
        as: 'categories',
        onDelete: 'CASCADE'
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

    //MediaFiles → User
    MediaFiles.belongsTo(User, {
        foreignKey: "userId",
        as: "user",
        onDelete: 'CASCADE'
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




    // User → ContactUs
    User.hasMany(ContactUs, {
        foreignKey: "userId",
        as: 'contacts'
    })

    // ContactUs → User
    ContactUs.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
        onDelete: 'CASCADE',
    });

}