const appErr = require("../UTILS/appErr");

const protected = (req, res, next)  => {
     //check if user is login
     if(req.session.userAuth) {
          next();
     } else {
       res.render("USERS/notAuthorize.ejs");
     };
};
module.exports = protected;