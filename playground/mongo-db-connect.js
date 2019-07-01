 const MongoClient = require('mongodb').MongoClient;
// const {MongoClient,ObjectID} = require('mongodb');//this way in angular and it takes the property in the mongodb library and store it an a variable

   MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser: true },(err,client) => {
        if(err){
            return console.log("Unable To connect the database" + err);
        }
        console.log("Connected To MongoDB");

            // const db = client.db('TodoApp');
            // db.collection('users').insertOne({
            //     name:'yasser',
            //     age:21,
            //     location:'Fifth settlment'
            // },(err,res) => {
            //     if(err){
            //         console.log("Unable to insert");    
            //     }
            //     console.log(JSON.stringify(res.ops,undefined,2));
                
            // })
            



        client.close();
   });
