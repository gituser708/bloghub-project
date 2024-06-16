const Post = require("../../MODELS/post/Post");
const User = require("../../MODELS/user/User");
const appErr = require("../../UTILS/appErr");
//* create post
const createPostCtrl = async (req,res, next) => {
     const {title, description, category,} = req.body;
     try {
          if(!title || !description || !category || !req.file) {
               return res.render("POSTS/addPost.ejs", {
                    error: "All fields are required to create post",
               });
          };
          // find the user
          const userId = req.session.userAuth;
          const userFound = await User.findById(userId);
          // create the post
          const postCreated = await Post.create({
               title,
               description,
               category,
               user: userFound._id,
               image: req.file.path,
          });
     // push the post created into the array of user's post
     userFound.posts.push(postCreated._id);
         // re-save the userData in database
     await userFound.save()
          // redirect user
          res.redirect("/");
     } catch(error) {
          return res.render("POSTS/addPost.ejs", {
               error: error.message,
          });
     };
};

//* fetch  posts
const fetchPostCtrl = async (req,res, next) => {
     try {
          const posts = await Post.find().populate("comments")
          .populate("user");
          res.render("POSTS/posts.ejs", {posts});
     } catch(error) {
         next(appErr(error.message));
     };
};



//* post details
const postDetailCtrl = async (req,res, next) => {
     try {
           // get the id from params
     const id = req.params.id;
     //  find the post
     const post = await Post.findById(id).populate({
          path: "comments",
          populate: {
               path: "user",
          },
     }).populate("user");
         res.render("POSTS/postDetails.ejs", {
          post,
          error: "",
         })
     } catch(error) {
         next(appErr(error.message));
     };
};
//* delete posts
const deletePostCtrl = async (req,res, next) => {
     try {
          // find the post
          const post = await Post.findById(req.params.id);
     // check the post is belong to the user before deleted
     if(post.user.toString() !== req.session.userAuth.toString()) {
    return res.render("POSTS/postDetails.ejs", {
     error: "You are not allowed to delete this post",
     post,
    });
          };
          // delete post
          await Post.findByIdAndDelete(req.params.id);
          // redirect user
          res.redirect("/");
     } catch(error) {
          return res.render("POSTS/postDetails.ejs", {
               error: error.message,
               post: "",
              });
     };
};

//* update posts
const updatePostCtrl = async (req,res, next) => {
     const {title, description, category} = req.body;
     try {
      // find the post
       await Post.findById(req.params.id);
      // check the post is belong to the user before deleted
      if(post.user.toString() !== req.session.userAuth.toString()) {
       res.render("POSTS/updatePost.ejs", {
          post: "",
          error: "You are not authorized to update this post",
       });
     };
     // check if user trying to update image
     if (req.file) {
           await Post.findByIdAndUpdate(req.params.id, {
               title,
               description,
               category,
               //user: userFound._id,
               image: req.file.path,
          }, 
             {
                new: true,
              },
          );
     } else {
          // update
     const postUpdated = await Post.findByIdAndUpdate(req.params.id, {
          title,
          description,
          category,
     }, 
        {
           new: true,
         },
     );
     };
         // redirect user 
         res.redirect("/");
     } catch(error) {
          res.render("POSTS/updatePost.ejs", {
             post: "",
             error: error.message,
          });
     };
};

module.exports = {
     createPostCtrl, fetchPostCtrl, postDetailCtrl, 
     deletePostCtrl, updatePostCtrl };
     