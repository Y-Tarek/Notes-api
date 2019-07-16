require('./config/config');
var express = require('express');
var bodyParser = require('body-parser')
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo'); 
const {Users} = require('./models/users');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
var app = express();

//configure node middleware
  app.use(bodyParser.json()); 

    //Post requests for todos 
        app.post('/todos',(req,res) => {

        var newTodo = new Todo({
            text:req.body.text
        });

        newTodo.save().then((doc) => {
            res.send(doc);
        },(e)=>{
            res.status(400).send(e);
        })

        });

//Post requests for users
        app.post('/users',(req,res) => {
            var newUser = new Users({
                email: req.body.email
            });
            newUser.save().then((user) => {
                res.send(user);
            },(e) => {res.status(400).send(e)})
        });
 
 // Get requests for todos 
        app.get('/todos',(req,res) => {
            Todo.find().then((todos) => {
                res.send({todos:todos});
            },(e) => {
                console.log(e);
            })
        })
// Get request for getting a specific Todo
        app.get('/todos/:id',(req,res) => {
            var id  = req.params.id;
            if(!ObjectID.isValid(id)){
               return  res.status(404).send();
            }
            Todo.findById(id).then((todo) => {
                if(!todo){
                   return  res.status(404).send()
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

// Delete reuest for deleting a todo
      app.delete('/todos/:id',(req,res) => {
          var id = req.params.id;
                if(!ObjectID.isValid(id)){
                    return res.status(404).send();
                }
          Todo.findByIdAndDelete(id).then((result) => {
                if(!result){
                    return res.status(404).send();
                }
              res.send({result});
          },(e) => {
              return res.status(404).send(e);
          }
       )
    })

// Update request for updating todo 
    app.patch('/todos/:id',(req,res) => {
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

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
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
 