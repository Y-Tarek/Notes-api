var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var pass = '123abc!';
var hashedPassword = '$2a$10$aKnIr8C9XXxdGAQoPa18J.mzRtUtKSqPC0AWDAHW8R0MpMdcyMWmm';
// var data = {
//     id:10
// };
// var token = jwt.sign(data, 'shhhhh');

// console.log(token);

bcrypt.genSalt(10,(err,salt) => {
    bcrypt.hash(pass,salt,(err,hash) => {
        console.log(hash);
        
    });
}); 

bcrypt.compare(pass,hashedPassword,(err,res) => {
    console.log(res);
    
})