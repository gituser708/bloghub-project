//* truncate
const truncatePost = post => {
     if(post.length > 20) {
          return post.substring(0,20) + "...";
     };
     return post;
};

module.exports = {
     truncatePost,
};