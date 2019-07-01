const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client) => {
    if(err){
        console.log(err);
    }
    console.log("Connected To Mongodb");
     var db = client.db('TodoApp');
     db.collection('users').deleteMany({name:'yasser'}).then((result) => { 
          console.log(result);
     },(err) =>{
         console.log(err);
     });

     db.collection('Todos').findOneAndDelete({_id: new ObjectID('5d19f5a7c475de3095dc204f')}).then((res) => {
            console.log(res);
     },(err) => {
            console.log(err);
     })
     client.close();
})
//delete one delete the first one to see,
// findOneAndDelete delete the first one and get the deleted value