const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client) => {
       if(err){
           return console.log("Unable To connect to Mongodb",err);
       }
         console.log("Connected To Mongodb");
             var db = client.db('TodoApp');
          db.collection('Todos').find({_id:new ObjectID('5d19f49419b94e2fcbf321e4')}).toArray().then((docs) => {
                  console.log(JSON.stringify(docs,undefined,2));
          },(err) => {
              console.log("Unable to fetch docs ", err);
          })
        
        db.collection('Todos').find().count().then((count)=>{
                 console.log(`Todos count: ${count}`);
        },(err)=>{
           console.log(err);
        })
       client.close();
});