var express = require('express');
var bodyParser = require('body-parser')
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo'); 
const {User} = require('./models/users');

var app = express();

app.use(bodyParser.json());

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

app.get('/todos',(req,res) => {
     Todo.find().then((todos) => {
         res.send({todos:todos});
     },(e) => {
         console.log(e);
     })
})


app.listen(3000,()=>{
    console.log('Server Started');
});

module.exports = {app:app};
 