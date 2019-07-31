const {Users} = require('./../models/users');

var authintcate = (req,res,next) => {
  var token  = req.header('x-auth');
  Users.findByToken(token).then((user) => {
      if(!user) {
          return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
  }).catch((E) => {res.status(401).send(E)});
};
module.exports = {authintcate};