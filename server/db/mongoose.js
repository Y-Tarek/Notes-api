const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true});//connect To Todo database

module.exports = {mongoose:mongoose};
