const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const passport = require('passport');
require('./config/passport');
const session = require('express-session');


const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes');
const employeeRoutes = require('./routes/employee.routes');
const commentUserRoutes = require('./routes/user-comment.route');
const adminStats = require("./routes/admin-stats.routes");
const uploadRoutes = require('./routes/upload.routes');
const adminReadBlogsRoutes = require('./routes/admin.blogs.routes');
const newsletterRoutes = require("./routes/subscribe.routes")
require('dotenv').config();
const sequelize = require('./config/database');





app.use(session({
  secret: 'jeux-secret',
  resave: false,
  saveUninitialized: true
}));
//INITIALIZE PASSPORT
app.use(passport.initialize());
app.use(passport.session());




// Middleware
app.use(cors({
  origin: "*", // Frontend url
  credentials: true,
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/user', commentUserRoutes);
app.use('/api/admin', adminStats);
app.use('/api', uploadRoutes);
app.use('/api/blog', adminReadBlogsRoutes);
app.use('/api', newsletterRoutes);



app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Express API Kit! 🚀",
    CreatedBy: "Express Generator API Kit Created by Muhammad Ahmad with ❤️.",
    status: "Running Smoothly ✅",
    version: "1.0.0",
  });
});

module.exports = app;
