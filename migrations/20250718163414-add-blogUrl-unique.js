'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const { QueryTypes } = Sequelize;
    
    try {
      // Check if blogUrl column already exists
      const tableDescription = await queryInterface.describeTable('blogs');
      
      if (!tableDescription.blogUrl) {
        // Step 1: Add the column without unique constraint
        await queryInterface.addColumn('blogs', 'blogUrl', {
          type: Sequelize.STRING,
          allowNull: true, // Allow null temporarily
        });
      }

      // Step 2: Get all existing blogs that need blogUrl
      const blogs = await queryInterface.sequelize.query(
        'SELECT id, title FROM blogs WHERE blogUrl IS NULL OR blogUrl = ""',
        { type: QueryTypes.SELECT }
      );

      console.log(`Found ${blogs.length} blogs that need blogUrl generation`);

      // Step 3: Update each blog with a unique URL
      for (const blog of blogs) {
        // Generate URL from title
        let baseUrl = blog.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .trim()
          .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
        
        // Fallback if title produces empty string
        if (!baseUrl) {
          baseUrl = 'blog';
        }

        // Create unique URL with blog ID
        const uniqueUrl = `${baseUrl}-${blog.id}`;
        
        await queryInterface.sequelize.query(
          'UPDATE blogs SET blogUrl = ? WHERE id = ?',
          { 
            replacements: [uniqueUrl, blog.id],
            type: QueryTypes.UPDATE 
          }
        );

        console.log(`Updated blog ${blog.id}: "${blog.title}" -> "${uniqueUrl}"`);
      }

      // Step 4: Now make the column NOT NULL and add unique constraint
      await queryInterface.changeColumn('blogs', 'blogUrl', {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      });

      console.log('Successfully added unique constraint to blogUrl column');

    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove the unique constraint and column
      await queryInterface.removeColumn('blogs', 'blogUrl');
      console.log('Successfully removed blogUrl column');
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }
};