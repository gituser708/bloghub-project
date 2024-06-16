const express = require ("express");
const postRoutes = express.Router();
const multer = require("multer");
const storage = require("../../CONFIG/Cloudinary");

const {createPostCtrl, fetchPostCtrl, postDetailCtrl,
deletePostCtrl, updatePostCtrl} = require("../../CONTROLLERS/POSTS/Posts");
const protected = require("../../MIDDLEWARES/protected");
const Post = require("../../MODELS/post/Post");

// instance of multer
const upload = multer({
     storage,
});

// add post form route
postRoutes.get("/add-post-form", (req,res) => {
     res.render("POSTS/addPost.ejs", {error: ""});
});

// all-posts
postRoutes.get("/all-posts", fetchPostCtrl, (req,res) => {
     res.render("POSTS/posts.ejs", {error:""}); 
});

// update post form
postRoutes.get("/update-post-form/:id", async (req,res) => {
     try {
          const post = await Post.findById(req.params.id);
          res.render("POSTS/updatePost.ejs", {post, error: ""});
     } catch(error) {
          res.render("POSTS/updatePosts.ejs", {error, post: ""});
     };
});

// set route for user posts
postRoutes.post("/", protected, upload.single("file"), createPostCtrl);

// set route for get posts
postRoutes.get("/", fetchPostCtrl)

// set route for get posts details
postRoutes.get("/:id", postDetailCtrl);

// set route for delete posts
postRoutes.delete("/:id", protected, deletePostCtrl);

// set route for update posts
postRoutes.put("/:id", protected, upload.single("file"), updatePostCtrl);


module.exports = postRoutes;