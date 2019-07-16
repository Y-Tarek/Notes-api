const {app} = require('./../server');
const {Todo} = require('./../models/todo'); 
const {Users} = require('./../models/users');
const {ObjectID} = require("mongodb");
const expect = require('expect');
const request = require('supertest');

// Random arrays for unit tests
    var todos = [
        {
            _id: new ObjectID(),
            text: 'banana'
        },
        {
            _id: new ObjectID(),
            text: 'botato'
        }
    ]

    var users = [
        {
            email: 'catx@ymail.com'
        },
        {
            email: 'botato@hotmail.com'
        }
    ]


  // cleaning the database from any data before unit tests  
    beforeEach((done) => {
        Todo.remove({}).then(() => {
            return Todo.insertMany(todos);
        }).then(() => {done()})
    })


    beforeEach((done) => {
        Users.remove({}).then(() => {
            return Users.insertMany(users);
        }).then(() => {done()})
    })

// Testing post requests for creating a todo
    describe('Post /todos',() => {
        it('should create a new todo',(done)=>{
            var text = 'Test  a new todo';
                request(app)
                .post('/todos')
                .send({text})
                .expect(200)
                .expect((res)=>{
                    expect(res.body.text).toBe(text)
                })
                .end((err,res) => {
                    if(err){
                        return done(err);
                    }
                    Todo.find({text}).then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text)
                        done();
                    }).catch((e) => {
                        done(e);
                    });
                });
        });

//  Testing post requests for not creating a todo
        it("should not create a new todo",(done) => {
            request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => {done(e)})

            })
        })


    });

// Testing Post requests for creating new users
    describe("Post /users",() => {
    it("should create a new user",(done) => {
        var email = "AhmedTarek@yahoo.com";
        request(app)
            .post('/users')
            .send({email})
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(email);
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                Users.find({email}).then((newuser) => {
                    expect(newuser.length).toBe(1);
                    expect(newuser[0].email).toBe(email)
                    done();
                }).catch((e) => {done(e)})
            })
       });
    });





// Testing Get requests for todos
    describe('Get /todos',() => {
        it("should return all todos",(done) => {
            request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
                .end(done)
        });
    });

// Testing Get a specific todo
    describe("Get /todos/:id",() => {
        it("should return a specific todo",(done) => {
            request(app)
             .get(`/todos/${todos[0]._id.toHexString()}`)
             .expect(200)
             .expect((res) => {
                 expect(res.body.todo.text).toBe(todos[0].text);
             })
             .end(done);
        });

        it("should return a 404 if id is not found",(done) => {
            var hexId = new ObjectID().toHexString();
            request(app)
             .get(`/todos/${hexId}`)
             .expect(404)
             .end(done)
        });

        it("should return  404 if objectid is not valid",(done) => {
            request(app)
             .get('/todos/123n')
             .expect(404)
             .end(done)
        })
    })


// Tseting Get requests for users
   describe('Get /users',() =>{
      it("should get all users",(done) => {
          request(app)
           .get('/users')
           .expect(200)
           .expect((res) => {
               expect(res.body.users.length).toBe(2)
           })
           .end(done);
      });
   });


// Testing Delete requests for deleting a todo by id
    describe('Delete /todo/:id',() => {
        it("should delete a todo by id",(done) => {
            var Id = todos[1]._id.toHexString();
            request(app)
             .delete(`/todos/${Id}`)
             .expect(200)
             .expect((res) => {
                 expect(res.body.result._id).toBe(Id);
             })
             .end((err,res) => {
                    if(err){
                       return done(err);
                    }
                    Todo.findById(Id).then((todo) => {
                        expect(todo).toBeFalsy()
                        done();
                    }).catch((e) => done(e));
                  
             });
        });

        it("should return 404 if id is not found",(done) => {
            var ID = new ObjectID().toHexString();
            request(app)
             .delete(`/todos/${ID}`)
             .expect(404)
             .end(done)
        });

        it("should return 404 if id not valid",(done) => {
            request(app)
             .delete('/todos/1234')
             .expect(404)
             .end(done)
        });
    })

// Testing updating a todo 
   describe("Patch /todos/:id",() => {
       it("should update a todo", (done) => {
           var id = todos[0]._id.toHexString();
           var txt = "Text is updated";
           request(app)
            .patch(`/todos/${id}`)
            .send({
                completed:true,
                text:txt
                
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(txt);
                expect(res.body.todo.completed).toBe(true)
            })
           .end(done);
       });
   })