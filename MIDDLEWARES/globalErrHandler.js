const globalErrHandler = (err,req,res,next) => {
     //status ---for show err msg
     //message ---set the custom error msg
     //stack --- to find the err in code or an file

     const stack = err.stack;
     const message = err.message;
     const status = err.status ? err.status : "faild";
     const statusCode = err.statusCode ? err.statusCode : 500;

     //* send response
     res.status(statusCode).json({
          message,
          status,
          stack
     });
};
module.exports = globalErrHandler;