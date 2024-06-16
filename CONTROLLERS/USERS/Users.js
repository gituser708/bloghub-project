const bcrypt = require('bcryptjs');
const User = require('../../MODELS/user/User');
const appErr = require ('../../UTILS/appErr');

//* Register controller
const registerCtrl = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  console.log(req.body);
  // check if all filld is empty
  if(!fullname || !email ||!password) {
    // return next(appErr("All fields are required!"));
    return res.render("USERS/register.ejs", {
     error: "All fields are required",
    });
  };
  try {
    // Check if user exists
    const userFound = await User.findOne({ email });
    if (userFound) {
      //return next(appErr("User already exist!"));
      return res.render("USERS/register.ejs", {
          error: "email already exist",
         });
    }

    //* Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    //* Register user
    const user = await User.create({
      fullname,
      email,
      password: passwordHashed,
    });
         //* redirect user
     res.redirect("/api/v1/users/profile-page");
  } catch (error) {
    res.status(500).json({ status: 'failed', error: error.message });
  }
};

//* login
const loginCtrl = async (req,res, next) => {
     const {email,password} = req.body;
     if(!email || !password) {
        //return next(appErr("Email and password is required to login!"));
        return res.render("USERS/login.ejs", {
          error: "Email and password is required to login",
         });
     }
     try {
     const userFound = await User.findOne({email});
     if(!userFound) {
          if(!userFound) {
             //return next(appErr("Invalid login credetinals!"));
             return res.render("USERS/login.ejs", {
               error: "Invalid login credetinals",
              });
          };
     };
     const isPasswordValid = await 
     bcrypt.compare(password, userFound.password);
     if (!isPasswordValid) {
          //return next(appErr("Invalid login credetinals!"));
          return res.render("USERS/login.ejs", {
               error: "Invalid login credetinals",
              });
     };
     // save user into session token
     req.session.userAuth = userFound._id;
     res.redirect("/api/v1/users/profile-page");
  } catch(error) {
     res.json(error);
  };
};
//* userDetails
const userDetailCtrl = async(req,res) => {
     try{
          // get user id from params
          const userId = req.params.id;
          // find the user
          const user = await User.findById(userId);
          res.render("USERS/updateUser.ejs", {
               user,
               error: "",
          });
     } catch(error) {
          res.render("USERS/updateUser.ejs", {
               error: error.message,
          });
     };
};
//* profile
const profileCtrl = async(req,res) => {
     try{
          // get the login user
          const userId = req.session.userAuth;
          // find the user
          const user  = await User.findById(userId)
          .populate("posts").populate("comments");
          res.render("USERS/profile.ejs", {user});
     } catch(error) {
       res.json(error);
     };
};
//* upload-profile-photo
const uploadProfilePicCtrl = async (req, res, next) => {
     //console.log(req.file.path);
     try {
          // check the file is exist
         if (!req.file) {
             return res.render("USERS/uploadProfilePhoto.ejs", {
                 error: "Please upload an image",
             });
         };
 
         // Find the user to be updated
         const userId = req.session.userAuth;
         const userFound = await User.findById(userId);
 
         if (!userFound) {
             return res.render("USERS/uploadProfilePhoto.ejs", {
                 error: "User not found",
             });
         };
 
         // Update profile photo
         await User.findByIdAndUpdate(userId, {
             profileImage: req.file.path,
         }, {
             new: true,
         });
 
         // Redirect
         res.redirect("/api/v1/users/profile-page");
     } catch (error) {
         return res.render("USERS/uploadProfilePhoto.ejs", {
             error: error.message,
         });
     };
 };
 
//* upload cover pic
const coverPicCtrl = async(req,res, next) => {
     //console.log(req.file.path);
     try{
      // check the file is exist
      if (!req.file) {
          return res.render("USERS/uploadCoverPhoto.ejs", {
              error: "Please upload an image",
          });
      };
          //1.find the user to be updated
          const userId = req.session.userAuth;
          const userFound = await User.findById(userId);
          // 2.check if user found
          if(!userFound) {
               return res.render("USERS/CoverPhoto.ejs", {
                    error: "User not found",
                });
          };
          // update profile photo
          await User.findByIdAndUpdate(
               userId,
               {
                    coverImage: req.file.path,
               },
               {
                    new: true,
               },
          );
          // Redirect
         res.redirect("/api/v1/users/profile-page");
     } catch(error) {
          return res.render("USERS/uploadCoverPhoto.ejs", {
               error: error.message,
           });
     };
}
//* update password
const updatePasswordCtrl = async(req,res, next) => {
     const {password} = req.body;
     try{
          // check if user is updating the password
          if(password) {
               const salt = await bcrypt.genSalt(10);
           const passwordHashed = await bcrypt.hash(password, salt);
           // update user
           await User.findByIdAndUpdate(
               req.session.userAuth,
               {
                    password: passwordHashed,
               },
               {
                    new: true,
               },
             );
          };
          res.redirect("/api/v1/users/profile-page");
     } catch {
          return res.render("USERS/updatePassword.ejs", {
               error: error.message,
          });
     };
};
         
          

     


//* uppdate user
const updateUserCtrl =  async(req, res,) => {
   const {fullname, email} = req.body;
     try{
          if(!fullname || !email) {
               return res.render("USERS/updateUser.ejs", {
                    error: "Please provide details",
                    user: "",
               });
          };
          // check if email exist
          if (email) {
               const emailExist = await User.findOne({email});
               if(emailExist) {
                return res.render("USERS/updateUser.ejs", {
                   error: "email is already exist",
                   user: "",
                 });
               }
          }
          // update the user
         await User.findByIdAndUpdate(
               req.session.userAuth,
               {
                    fullname,
                    email,
               },
               {
                    new: true, 
               }
          );
          res.redirect("/api/v1/users/profile-page");
     } catch(error) {
          return res.render("USERS/updateUser.ejs", {
               error: error.message,
               user: "",
           });
     };
};
//* logout user
const logoutCtrl =  async(req,res) => {
     // destroy login session
     req.session.destroy(() => {
          res.redirect("/api/v1/users/login");
     });
};

module.exports = {
   registerCtrl, loginCtrl, userDetailCtrl, profileCtrl, 
   uploadProfilePicCtrl, coverPicCtrl, updatePasswordCtrl,
   updateUserCtrl, logoutCtrl
}