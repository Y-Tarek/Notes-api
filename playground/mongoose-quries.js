const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Users} = require('./../server/models/users');// should be the name in module.exports in the users file

// check if the id is valid
    if(!ObjectID.isValid('5d2c495d2c45130ef0d9b66e')){
        console.log("ID not Valid");
    }
// Queiry To get user data by Id
    Users.findById('5d2c495d2c45130ef0d9b66e').then((Fuser)=>{
        if(!Fuser){
            console.log("User Nogt Found");   
        }
        console.log(Fuser);
    },(e) => {console.log(e)}).catch((E) => {
        console.log(E);
    })
