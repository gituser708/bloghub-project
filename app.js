require("dotenv").config();
require("./CONFIG/db");
const express = require ("express");
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

//* helpers
app.locals.truncatePost = truncatePost;

//* middlewares
 app.use(express.json());
 app.use(express.urlencoded({extended: true}));

 //* method override
 app.use(methodOverride("_method"));


 //* configure ejs
 app.set("view engine", "ejs");
 //* server static files
 app.use(express.static(__dirname, + "/PUBLIC"));

 //* use session
 app.use(
     session({
          secret: process.env.SESSION_KEY,
          resave: false,
          saveUninitialized: true,
          store: new MongoStore({
               mongoUrl: process.env.MONGODB_URL,
               ttl: 24 * 60 * 60, //1 day
          }), 
     }),
 );

 //* save the login user into locals
 app.use((req, res, next) => {
     if(req.session.userAuth) {
          res.locals.userAuth = req.session.userAuth;
     } else {
          res.locals.userAuth = null;
     };
     next();
 });

 //* render home
app.get('/', async (req, res) => {
     try {
      const posts = await Post.find().populate("user");
     res.render('index.ejs', {posts});
     } catch(error) {
          res.render("index.ejs", {error: error.message});
     };
});

//* users route
app.use("/api/v1/users", userRoutes);

//* post routes
app.use("/api/v1/posts", postRoutes);

//* comments routes
app.use("/api/v1/comments", commentRoutes);

//* error handler middlewares
app.use(globalErrHandler);
//* start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, 
     console.log(`Server is running on ${PORT}`));
