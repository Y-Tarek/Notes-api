require('./config/config');
var express = require('express');
var bodyParser = require('body-parser')
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo'); 
const {Users} = require('./models/users');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const {authintcate} = require('./middleware/authintcate');
var app = express();

//configure node middleware
  app.use(bodyParser.json()); 

    //Post requests for todos 
        app.post('/todos',authintcate,(req,res) => {

        var newTodo = new Todo({
            text:req.body.text,
            _creator:req.user._id
        });

        newTodo.save().then((doc) => {
            res.send(doc);
        },(e)=>{
            res.status(400).send(e);
        })

        });

//Post requests for users
        app.post('/users',(req,res) => {
            var body = _.pick(req.body,['email','password']);
            var user = new Users(body);
            user.save().then(() => {
                return user.generateAuthToken();
            }).then((token) => {
                res.header('x-auth',token).send(user);
            }).catch((e) => res.status(400).send(e))
        })


//Post request for login the idea to get the token 
        app.post('/users/login',(req,res) => {
            var body = _.pick(req.body,['email','password']);
            Users.findByCredintials(body.email,body.password).then((user) => {
                return user.generateAuthToken().then((token) => {
                    res.header('x-auth',token).send(user);
                }).catch((e) => res.status(400).send(e))
            })
        })
 
 // Get requests for todos 
        app.get('/todos',authintcate,(req,res) => {
            Todo.find({_creator:req.user._id}).then((todos) => {
                res.send({todos:todos});
            },(e) => {
                console.log(e);
            })
        })
// Get request for getting a specific Todo
        app.get('/todos/:id',authintcate,(req,res) => {
            var id  = req.params.id;
            if(!ObjectID.isValid(id)){
               return  res.status(404).send();
            }
            Todo.findOne(
            {
                _id:id,
                _creator:req.user._id
            }
            ).then((todo) => {
                if(!todo){
                   return  res.status(404).send();
                }
                res.send({todo});
            },(e) => {res.status(400).send(e)})
        })
        
        
// Get request for getting Users
       app.get('/users',(req,res) => {
           Users.find().then((users) => {
               res.send({users})
           },(e) => {res.status(400).send(e)});
       });


// Get request for an indivual user that have an access
       app.get('/users/me',authintcate,(req,res) => {
         res.send(req.user);
       });

// Delete reuest for deleting a todo
      app.delete('/todos/:id',authintcate,(req,res) => {
          var id = req.params.id;
                if(!ObjectID.isValid(id)){
                    return res.status(404).send();
                }
          Todo.findOneAndDelete({
              _id:id,
              _creator:req.user._id
          }).then((result) => {
                if(!result){
                    return res.status(404).send();
                }
              res.send({result});
          },(e) => {
              return res.status(404).send(e);
          }
       )
    })

// logout a user that is authintcated\

   app.delete('/users/me/logout',authintcate,(req,res) =>{
      req.user.removeToken(req.token).then(() => {
          res.status(200).send();
      }).catch((e) => res.status(404).send())
   })

// Update request for updating todo 
    app.patch('/todos/:id',authintcate,(req,res) => {
        var id = req.params.id;
        var body = _.pick(req.body,['text', 'completed']);
            if(!ObjectID.isValid(id)){
                return res.status(400).send();
            }
            
            if(_.isBoolean(body.completed) && body.completed){
                body.completedAt = new Date().getTime();   
            }else{
                body.completedAt = null;
                body.completed = false;
            }

    Todo.findOneAndUpdate({_id:id,_creator:req.user._id}, {$set: body}, {new: true}).then((todo) => {
            if(!todo){
                res.status(404).send();
            }
        res.send({todo});
    }).catch((e) => res.status(400).send(e))
 })


// Listening to port 3000
    app.listen(3000,()=>{
        console.log('Server Started');
    });

module.exports = {app:app};
 