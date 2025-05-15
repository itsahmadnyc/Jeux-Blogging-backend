const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User, UserVisit} = require('../models');
const response = require("../utils/responseHandler");
const logger = require("../utils/logger")


const JWT_SECRET = process.env.JWT_SECRET || 'SalaarSikandar@009';



exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return response.badRequest(res, 'Name, email, and password are required');
    }

    if (password.length < 6) {
      return response.badRequest(res, 'Password length should be greater then 6 characters..! ');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return response.badRequest(res, 'User already exists');

    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    await user.save();

    return response.created(res, 'User registered successfully', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error('Register Error:', error);
    return response.internalServerError(res, 'Something went wrong during registration', { error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response.badRequest(res, 'Email and Password are required..!')
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return response.notFound(res, 'User not found');


    if(user.isBlocked){

      if(req.user.role !== 'admin'){
        return response.unauthorized(res, "Access denied. Your account is blocked by Admin");
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return response.badRequest(res, 'Invalid credentials');



    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    await user.save();

    return response.ok(res, 'Login successful', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
      
    });
  } catch (error) {
    console.error('Login Error:', error);
    return response.internalServerError(res, 'Something went wrong during login', { error: error.message });
  }
};






exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



