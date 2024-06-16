const express = require ("express");
const userRoutes = express.Router();
const protected = require("../../MIDDLEWARES/protected");
const storage = require("../../CONFIG/Cloudinary");
const multer = require("multer");
const {registerCtrl, loginCtrl, userDetailCtrl,  profileCtrl,
uploadProfilePicCtrl, coverPicCtrl, updatePasswordCtrl,
updateUserCtrl, logoutCtrl } = require("../../CONTROLLERS/USERS/Users");

const upload = multer({storage}); //instance of multer

//* render login form
userRoutes.get('/login', (req,res) => {
     res.render("USERS/login.ejs", {
          error: "",
     });
});

//* render register form
userRoutes.get('/register', (req,res) => {
     res.render("USERS/register.ejs", {
          error: "",
     });
});

//* update password form
userRoutes.get('/update-password-form', (req,res) => {
    res.render("USERS/updatePassword.ejs", {
     error: "",
    });
});


//* render profile page
//userRoutes.get('/profile-page', (req,res) => {
 //    res.render("USERS/profile.ejs");
//});

//* upload profile photo
userRoutes.get('/upload-profile-photo-form', (req,res) => {
     res.render("USERS/uploadProfilePhoto.ejs", {
          error: "",
     });
});

//* upload cover photo
userRoutes.get('/upload-cover-photo-form', (req,res) => {
     res.render("USERS/uploadCoverPhoto.ejs", {
          error: "",
     });
});

// routes for user registration
userRoutes.post("/register", registerCtrl);
// route for user login
userRoutes.post("/login", loginCtrl);
// get user profile routes
userRoutes.get("/profile-page", protected, profileCtrl);
// set profile-pic-upload route
userRoutes.put("/profile-pic", protected,
     upload.single("profile"),uploadProfilePicCtrl);
// set profile-cover-pic-upload route
userRoutes.put("/cover-profile-pic", protected,
     upload.single("profile"),coverPicCtrl);

// set user update-password route
userRoutes.put("/update-password", updatePasswordCtrl);
// set route for update user
userRoutes.put("/update", updateUserCtrl,);
// set user logout route
userRoutes.get("/logout", logoutCtrl);
// get user details route
userRoutes.get("/:id", userDetailCtrl);



module.exports = userRoutes;
