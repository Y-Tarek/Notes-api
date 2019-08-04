const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// Creating  users (table or model)
//Schema used to allow operations on tables 
  var UserSchema = new mongoose.Schema({
      email:{
          type:String,
          required:true,
          trim:true,
          unique:true,
          validate:{
             validator: (value) => {
                   return validator.isEmail(value)
             },
              message: '{VALUE} is not a valid email'
          },
      },

      password : {
        type:String,
        required: true,
        minlength:5,
      },

      tokens: [{
        access: {
          type:String,
          required:true
        },
        token: {
          type: String,
          required:true
        }
      }]

    });

      UserSchema.methods.toJSON = function(){
        var user = this;
        var userObject = user.toObject();
          return _.pick(userObject,['tokens','email','_id']);
      };


      UserSchema.methods.generateAuthToken = function(){
        var user = this;
        var access = 'auth';
        var token = jwt.sign({_id: user._id,access:access},process.env.JWT_SECRET);
          user.tokens.push({
            access,
            token
          });
          return user.save().then(() => {
          return token;
        });
      }


      UserSchema.methods.removeToken = function(token){
        var user=this;
        return user.update({
          $pull: {
            tokens:{
              token:token
            }
          }
        })
      }


      UserSchema.statics.findByToken = function(token){
       var user = this;
       var decoded;
         try{
          decoded = jwt.verify(token,process.env.JWT_SECRET);
          
          
         }catch(e){
           console.log(e);
            return Promise.reject();
            
         }
         return user.findOne({
           '_id' : decoded._id,
          'tokens.token' : token,
          'tokens.access' : 'auth'
         });
      };

      UserSchema.statics.findByCredintials = function(email,password){
         var user = this;
         return user.findOne({
           email
         }).then((user) => {
           if(!user){
             return Promise.reject();
           }
           return new Promise((resolve,reject)=>{
             bcrypt.compare(password,user.password,(err,res) => {
               if(res){
                 resolve(user);
               }else{
                 reject();
               }
             })
           })
         })
      }

      UserSchema.pre('save',function(next){
        var user = this;
          if(user.isModified('password')){
            bcrypt.genSalt(10,(err,salt) => {
              bcrypt.hash(user.password,salt,(err,hash) => {
                user.password = hash;
                next();
              })
            })
          }else{
            next();
          }
      })

    var users = mongoose.model('users',UserSchema);

     module.exports = {Users:users}