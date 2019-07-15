var express = require('express');
var bodyParser = require('body-parser')
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo'); 
const {User} = require('./models/users');
const {ObjectID} = require('mongodb');
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
            var newUser = new User({
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
                   return  res.status(400).send()
                }
                res.send({todo});
            },(e) => {res.status(400).send(e)})
        })



// Listening to port 3000
    app.listen(3000,()=>{
        console.log('Server Started');
    });

module.exports = {app:app};
 