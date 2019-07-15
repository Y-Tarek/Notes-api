const mongoose = require('mongoose');
var todo = mongoose.model('Todo',{
    text:{
       type: String,
       required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    completedAt:{
        type:Number,
        default:null
    }
 });
module.exports = {Todo:todo} 