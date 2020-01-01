const {Users} = require('./../models/users');

var authintcate = (req,res,next) => { //next function is esseintial for any middleware as it calls the next middleware to work
  var token  = req.header('x-auth');  
  Users.findByToken(token).then((user) => {
      if(!user) {
          return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
  }).catch((e) => {res.status(401).send(e)});
};
module.exports = {authintcate};