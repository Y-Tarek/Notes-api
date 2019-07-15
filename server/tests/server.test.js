const {app} = require('./../server');
const {Todo} = require('./../models/todo'); 
 const {User} = require('./../models/users');
const expect = require('expect');
const request = require('supertest');
// Random arrays for unit tests
    var todos = [
        {
            text: 'banana'
        },
        {
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
        User.remove({}).then(() => {
            return User.insertMany(users);
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
        var mail = "AhmedTarek@yahoo.com"
        request(app)
            .post('/users')
            .send(mail)
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(mail);
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                User.find({mail}).then((newuser) => {
                    expect(newuser[0].email).toBe(mail)
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


// Tseting Get requests for users
    describe('Get /users',() => {
        it("should return all users",(done) => {
            request(app)
            .get('/users')
            .expect(200)
            .expect((res) => {
                expect(res.body.users.length).toBe(2);
            })
            .end(done)
        });
    });