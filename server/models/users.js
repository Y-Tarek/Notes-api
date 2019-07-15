const mongoose = require('mongoose');

// Creating  users (table or model)
  var users = mongoose.model('users',{
      email:{
          type:String,
          required:true,
          trim:true
      }
    });

  module.exports = {Users:users}