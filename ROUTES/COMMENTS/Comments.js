const express = require("express");
const commentRoutes = express.Router();

const {createCommentCtrl, commentDatailsCtrl, deleteCommentCtrl,
  updateCommentCtrl} = require("../../CONTROLLERS/COMMENT/Comments");
const protected = require("../../MIDDLEWARES/protected");

// set route for post comments
commentRoutes.post("/:id", protected, createCommentCtrl);

// set route for comments details
commentRoutes.get("/:id", commentDatailsCtrl);

// set route for delete comments
commentRoutes.delete("/:id", protected, deleteCommentCtrl);

// set route for update comments
commentRoutes.put("/:id", protected, updateCommentCtrl);

module.exports = commentRoutes;