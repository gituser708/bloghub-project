const Comment = require("../../MODELS/comment/Comment");
const Post = require("../../MODELS/post/Post");
const User = require("../../MODELS/user/User");
const appErr = require("../../UTILS/appErr");

//* create comment
const createCommentCtrl = async (req, res, next) => {
  const { message } = req.body;

  try {
    // find the post
    const post = await Post.findById(req.params.id);

    if (!post) {
      return next(appErr("Post not found", 404));
    }

    // create the comment
    const comment = await Comment.create({
      user: req.session.userAuth,
      message,
      post: req.params.id, // include the post ID here
    });

    // push the comment in post
    post.comments.push(comment._id);

    // find the user
    const user = await User.findById(req.session.userAuth);

    if (!user) {
      return next(appErr("User not found", 404));
    }

    // push the comment into user
    user.comments.push(comment._id);

    // disable validation
    // save
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
    // redirect
    res.redirect(`/api/v1/posts/${post._id}`);
  } catch (error) {
    next(appErr(error));
  }
};

//* comment details
const commentDatailsCtrl = async (req,res, next) => {
     try {
          // get the id from params
    const id = req.params.id;
    //  find the post
    const comment = await Post.findById(id).populate("comments");
         res.json({
              status: "success",
              data: comment,
         });
    } catch(error) {
        next(appErr(error.message));
    };
};

//* delete comment
const deleteCommentCtrl = async (req,res, next) => {
     try {
          // find the comment
          const comment = await Comment.findById(req.params.id);
     // check the post is belong to the user before deleted
     if(comment.user.toString() !== req.session.userAuth.toString()) {
  return next(appErr("You are not allowed to delete other comment", 403));
          };
          // delete comment
          await Comment.findByIdAndDelete(req.params.id);
          // redirect
          res.redirect(`/api/v1/posts/${req.query.postId}`);
     } catch(error) {
         next(appErr(error));
     };
};

//* update comment
const updateCommentCtrl = async (req,res, next) => {
     try {
          // find the post
          const comment = await Comment.findById(req.params.id);
          // check the post is belong to the user before deleted
          if(comment.user.toString() !== req.session.userAuth.toString()) {
    return next(appErr("You are not allowed to update other comment", 403));
         };
         // update
   const commentUpdated = await Comment.findByIdAndUpdate(req.params.id, 
         {
             message: req.body.message,
         }, 
            {
               new: true,
             },
         );
              res.json({
                   status: "success",
                   data: commentUpdated,
              });
         } catch(error) {
             next(appErr(error));
         };
};

module.exports = {
     createCommentCtrl, commentDatailsCtrl, 
     deleteCommentCtrl, updateCommentCtrl};
