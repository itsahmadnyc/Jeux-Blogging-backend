const { User, Blog, Category, Like, Comment, ContactUs } = require("../models");
const { sendEmail } = require("../services/emailService");
const response = require("../utils/responseHandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { buildCommentTree } = require("../utils/buildCommentTree");
const APP_BASE_URL = process.env.BASE_URL;



const JWT_SECRET = process.env.JWT_SECRET || "secret-key";

// ADD EMPLOYEE
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, password, employeeId } = req.body;

    // Basic validation
    if (!name || !email || !password || !employeeId) {
      return response.badRequest(
        res,
        "Name, email, Password and EmployeeId are required"
      );
    }

    if (password.length < 6) {
      return response.badRequest(
        res,
        "Password must be at least 6 characters long"
      );
    }

    //   const existingUser = await User.findOne({ where: { email } });
    // if (existingUser) {
    //   return response.badRequest(res, 'Employee already exists');
    // }

    const hashedPassword = await bcrypt.hash(password, 10);

    // const baseUrl = `${req.protocol}://${req.get("host")}`;

    const profileImage = req.file
      ? `${APP_BASE_URL}/uploads/${req.file.filename}`
      : null;

    const employee = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImage,
      employeeId,
      role: "employee", // FORCE ROLE AS EMPLOYEE
    });

    const token = jwt.sign(
      { id: employee.id, role: employee.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const subject  = "Welcome to Jeux Developers team..!";
    const text = `Hi ${name}, \n\nYou have been added as an employee. Your email Id is ${employeeId}.\n\nWelcome in Jeux! \n\nBest Regards, \nAdmin Team `;

    const html = `
    <p> Hi <strong>${name}</strong>, </p>
    <p> You have been added as an emplyoee to our system. </p>
    <p> <strong> Employee ID: </strong> ${employeeId} </p>
    <p> Welcome aboard! </p>
    <br />
    <p> Best regards, <br/> Admin Team </p>
    `;

    await sendEmail(email, subject, text, html);


    return response.created(res, "Employee added successfully", {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      profileImage: employee.profileImage,
      employeeId: employee.employeeId,
      role: employee.role,
      token,
    });
  } catch (error) {
    console.error("Add Employee Error:", error);
    return response.internalServerError(res, "Failed to add employee", {
      error: error.message,
    });
  }
};


//GET ALL EMPLOYEE
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.findAll({
      where: { role: "employee" },
      attributes: [
        "id",
        "name",
        "email",
        "profileImage",
        "employeeId",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    return response.ok(res, "Employees fetched successfully", { employees });
  } catch (error) {
    console.error("Get All Employees Error:", error);
    return response.internalServerError(res, "Failed to fetch employees", {
      error: error.message,
    });
  }
};



//DELETE EMPLOYEE
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findOne({ where: { id, role: "employee" } });

    if (!employee) {
      return response.notFound(
        res,
        "Employee not found or not authorized to delete"
      );
    }

    await employee.destroy();

    return response.deleted(res, "Employee deleted successfully");
  } catch (error) {
    console.error("Delete Employee Error:", error);
    return response.internalServerError(res, "Failed to delete employee", {
      error: error.message,
    });
  }
};



// UPDATE EMPLOYEE
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, password, employeeId } = req.body;
    const employee = await User.findOne({ where: { id, role: "employee" } });

    if (!employee) {
      return response.notFound(res, "Employee not found");
    }

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (employeeId) employee.employeeId = employeeId;

    if (password) {
      if (password.length < 6) {
        return response.badRequest(
          res,
          "Password must be at least 6 characters long"
        );
      }
      employee.password = await bcrypt.hash(password, 10);
    }

    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      employee.profileImage = `${baseUrl}/uploads/${req.file.filename}`;
    }

    await employee.save();
    return res.status(200).json({
      message: "Employee updated successfully",
      status: 200,
      data: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        profileImage: employee.profileImage,
        role: employee.role,
      },
    });
  } catch (error) {
    console.error("Update Employee Error:", error);
    return response.internalServerError(res, "Failed to update employee", {
      error: error.message,
    });
  }
};



//EMPLOYEE BY ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await User.findOne({
      where: { id },
      attributes: ["id", "name", "email", "role", "createdAt", "updatedAt"],
    });
    if (!employee) {
      return response.notFound(res, "Employee not found");
    }

    return response.ok(res, "Employee fetched by id successfully", {
      employee,
    });
  } catch (error) {
    console.error("Error to get Employee");
    return response.internalServerError(res, "Failed to add employee", {
      error: error.message,
    });
  }
};



exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: "user" },
      attributes: ["id", "name", "email", "profileImage", "createdAt"],
      order: [["createdAt", "DESC"]],
    });

    return response.ok(res, "All users fetched successfully", { users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return response.internalServerError(res, "Failed to fetch users", {
      error: error.message,
    });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id, role: "user" } });
    if (!user) {
      return response.notFound(res, "User not found");
    }

    await user.destroy();

    return response.deleted(res, "User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return response.internalServerError(res, "Failed to delete user", {
      error: error.message,
    });
  }
};



// BELOW ARE, AS A USER CONTROLLERS

exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id; 

    if(!userId){
      return response.badRequest(res, "Token is missing or invalid");
    }
   
    if (!req.file) {
      return response.badRequest(res, "No image uploaded");
    }

    const baseUrl = process.env.BASE_URL;
    const profileImageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const user = await User.findByPk(userId);
    if (!user) {
      return response.notFound(res, "User not found");
    }

    user.profileImage = profileImageUrl;
    await user.save();

    return response.updated(res, "Profile image updated", {
      id: user.id,
      name: user.name,
      profileImage: user.profileImage,
    });
  } catch (error) {
    console.error("Update profile image error:", error);
    return response.internalServerError(res, "Failed to update image", {
      error: error.message,
    });
  }
};


exports.contactUs = async (req, res) => {
  try {
    const { name, email, phoneNumber, projectType } = req.body;

    if (!name || !email || !phoneNumber || !projectType) {
      return response.badRequest(res, 'All fields are required.');
    }

    const contact = await ContactUs.create({
      name,
      email,
      phoneNumber,
      projectType,
    });

    // Email notification to admin
    const subject = `New Contact Request from ${name}`;
    const text = `
Hello Admin,

You received a new contact request:
Name: ${name}
Email: ${email}
Phone Number: ${phoneNumber}
Project Type: ${projectType}

Submitted via Jeux developers Platform.
    `;
    await sendEmail(email, subject, text);

    return response.created(res, 'Contact request submitted successfully !', contact);
  } catch (error) {
    console.error('Contact Us Error:', error);
    return response.internalServerError(res, 'Something went wrong.', { error: error.message });
  }
};


exports.getAllContactRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return response.notFound(res, "Token is missing or invalid");
    }

    const contacts = await ContactUs.findAll({
      attributes: ['id', 'name', 'email', 'phoneNumber', 'projectType', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });
    return response.ok(res, "All Contacts fetched successfully", { contacts })

  } catch (error) {
    console.error("Error to get all Contacts", error);
    return response.internalServerError(res, "Failed to fetch all contact ..!", { error: error.message })
  }

}


exports.userGetAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: { publish: true },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!blogs || blogs.length === 0) {
      return response.ok(res, "No published blogs available at the moment.", {
        blogs: [],
      });
    }

    return response.ok(res, "All published blogs fetched successfully.", {
      blogs,
    });
  } catch (error) {
    console.error(" Error fetching blogs:", error);
    return response.internalServerError(res, "Failed to fetch blogs.", {
      error: error.message,
    });
  }
};

exports.likeOrDislikeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { type } = req.body;
    const userId = req.user ? req.user.id : null; // allow anonymous likes

    if (!["like", "dislike"].includes(type)) {
      return response.notFound(
        res,
        'Invalid type, must be "like" or "dislike".'
      );
    }

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return response.notFound(res, "Blog not found..!");
    }

    let reaction;

    if (userId) {
      // Logged-in user logic
      const [existingReaction, created] = await Like.findOrCreate({
        where: { blogId, userId },
        defaults: { type },
      });

      if (!created) {
        if (existingReaction.type === type) {
          await existingReaction.destroy();
          return response.ok(res, `${type} removed`, { blogId, userId });
        } else {
          existingReaction.type = type;
          await existingReaction.save();
          return response.ok(res, `Changed to ${type}`, { blogId, userId });
        }
      }

      return response.created(res, `${type} added`, { blogId, userId });
    } else {
      // Anonymous user logic
      reaction = await Like.create({
        blogId,
        type,
        userId: null,
      });


      console.log(" Reaction is: ",reaction)
      return response.created(res, `${type} added anonymously`, {
        blogId,
        userId: null,
      });
    }
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Server Error", {
      error: error.message,
    });
  }
};



exports.addCommentsOrReply = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user ? req.user.id : null;

    if (!content) {
      return response.notFound(res, "Content is not found..!");
    }

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return response.notFound(res, "Blog is not found");
    }
    

if (parentId) {
  const parentComment = await Comment.findOne({
    where: {
      id: parentId,
      blogId: blogId, //Ensure it is the comment of same blog
    },
  });

  if (!parentComment) {
    return res.status(400).json({
      message: "Invalid parentId: No such comment exists for this blog",
    });
  }
}


    // if (parentId) {
    //   const parentComment = await Comment.findByPk(parentId);
    //   if (!parentComment) {
    //     return res.status(404).json({ message: "Parent comment not found" });
    //   }
    // }


    const comment = await Comment.create({
      content,
      userId, // May be null for anonymous
      blogId,
      parentId: parentId || null,
    });

    return response.ok(res, "Comment is added successfully", comment);
  } catch (error) {
    console.error("Error in addCommentsOrReply:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



exports.userDeleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return response.notFound(res, "Token is missing or inValid..!");
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return response.notFound(res, "User is not found..!");
    }
    await user.destroy();
    return response.deleted(
      res,
      "User account has been deleted successfully..!"
    );
  } catch (error) {
    return response.internalServerError(
      res,
      "Server Error.! Faild to delete user account..!",
      { error: error.message }
    );
  }
};




exports.getCommentsWithReplies = async (req, res) => {
  try {
    const { blogId } = req.params;

    const comments = await Comment.findAll({
      where: { blogId: blogId },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    const commentTree = buildCommentTree(comments);

    res.status(200).json({ success: true, comments: commentTree });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong fetching comments",
      });
  }
};
