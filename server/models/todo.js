const mongoose = require('mongoose');

// creating Todo (table or model)
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
        },
        _creator: {
            required:true,
            type:mongoose.Schema.Types.ObjectId
        }
    });
    
module.exports = {Todo:todo} 