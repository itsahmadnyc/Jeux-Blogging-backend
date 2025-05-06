const { Category, User } = require("../models");
const response = require("../utils/responseHandler");



exports.addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;


        if (!name || !description) {
            return response.badRequest(res, 'Name and Description are required!');
        }

        const trimmedName = name.trim();
        const trimmedDescription = description.trim();

        // Check if category with the same name exists (case insensitive)
        const existing = await Category.findOne({
            where: { name: trimmedName }
        });

        if (existing) {
            return response.badRequest(res, 'Category already exists');
        }

        const category = await Category.create({
            name: trimmedName,
            description: trimmedDescription,
            userId,
        });

        return response.created(res, 'Category added successfully', { category });
    } catch (error) {
        console.error('Error adding category:', error);
        return response.internalServerError(res, 'Failed to add category', { error: error.message });
    }
};


exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({
            attributes: ['id', 'name', 'description', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });

        if (!categories.length) {
            return response.ok(res, 'No categories found', { categories: [] });
        }

        return response.ok(res, 'Categories fetched successfully', { categories });

    } catch (error) {
        console.error('Error fetching categories:', error.message);
        return response.internalServerError(res, 'Failed to fetch categories', { error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        if (!name || !description) {
            return response.badRequest(res, "Name and description are required.");
        }

        const category = await Category.findByPk(id);

        if (!category) {
            return response.notFound(res, "Category not found.");
        }

        category.name = name;
        category.description = description;

        await category.save();

        return response.updated(res, "Category updated successfully.", { category });
    } catch (error) {
        console.error("Error while updating category:", error);
        return response.internalServerError(res, "Failed to update category", {
            error: error.message,
        });
    }
};


exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const delCategory = await Category.findOne({ where: { id } });
        if (!delCategory) {
            return response.notFound(res, 'Category not found..!')
        }

        await delCategory.destroy();

        return response.deleted(res, 'Category deleted successfully');

    } catch (error) {
        console.error("Error while deleting category..!");
        return response.internalServerError(res, 'Failed to delete category', { error: error.message });
    }
}


exports.getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
  
      const category = await Category.findOne({
        where: { id },
        attributes: ['id', 'name', 'description', 'createdAt', 'updatedAt']
      });
  
      if (!category) {
        return response.notFound(res, 'Category not found');
      }
  
      return response.ok(res, 'Category fetched successfully', { category });
  
    } catch (error) {
      console.error('Error fetching category by ID:', error.message);
      return response.internalServerError(res, 'Failed to fetch category', { error: error.message });
    }
  };

  
  
