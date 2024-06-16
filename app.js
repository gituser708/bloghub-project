require("dotenv").config();
require("./CONFIG/db");
const express = require ("express");
const path = require('path');
const fs = require('fs');  // Import the fs module
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const userRoutes = require ("./ROUTES/USERS/Users");
const postRoutes = require ("./ROUTES/POSTS/Posts");
const commentRoutes = require ("./ROUTES/COMMENTS/Comments");
const globalErrHandler = require("./MIDDLEWARES/globalErrHandler");
const Post = require("./MODELS/post/Post");
const { truncatePost } = require("./UTILS/helpers");



const app = express();

// Helpers
app.locals.truncatePost = truncatePost;  // Assuming truncatePost is defined somewhere

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Method override
app.use(methodOverride("_method"));

// Set the views directory
const viewsPath = path.join(__dirname, 'views');
console.log('Views Path:', viewsPath);  // Debugging line to check the path
app.set('views', viewsPath);

// Debugging: List files in the views directory
fs.readdir(viewsPath, (err, files) => {
  if (err) {
    console.error('Error reading views directory:', err);
  } else {
    console.log('Files in views directory:', files);
  }
});

// Configure EJS
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'PUBLIC')));

// Use session
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URL,
      ttl: 24 * 60 * 60, // 1 day
    }), 
  })
);

// Save the login user into locals
app.use((req, res, next) => {
  if (req.session.userAuth) {
    res.locals.userAuth = req.session.userAuth;
  } else {
    res.locals.userAuth = null;
  }
  next();
});

// Render home
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.render('index', { posts });
  } catch (error) {
    res.render('index', { error: error.message });
  }
});

// Users route
app.use('/api/v1/users', userRoutes);

// Post routes
app.use('/api/v1/posts', postRoutes);

// Comments routes
app.use('/api/v1/comments', commentRoutes);

// Error handler middlewares
app.use(globalErrHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});