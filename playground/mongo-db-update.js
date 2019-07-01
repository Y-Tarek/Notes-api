const {MongoClient,ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp',{useNewUrlParser:true},(err,client) => {
      if(err){
          console.log(err);
      }
      console.log("connected");
      var db = client.db('TodoApp');
       db.collection('Todos').findOneAndUpdate(
        {
            _id: new ObjectID('5d19f49419b94e2fcbf321e4')
        },
        {
            $set:{text: 'something to watch'}
        },
        {
            returnOriginal:false
        }).then(
          (res)=>{
            console.log(res);
        },
          (err) => {
            console.log(err);
            });

        db.collection('users').findOneAndUpdate(
            {
               _id: new ObjectID("5d1a24afa2c08d78da56b83f")
            },
            {
              $set:{name:'yasser'},
              $inc:{age:1}
            },
            {
              returnOriginal:false
            }).then((res) => {
                 console.log(res);
            },(err) => {
                 console.log(err)
            })
        client.close();
});