var expect = require('expect');
var request = require('supertest');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
},{
    _id: new ObjectID,
    text: 'Second test todo'
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=> {
        Todo.insertMany(todos)
}).then(()=>done());
});

describe('Post /todos',()=>{
     it('should create a new todo',(done)=>{
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res)=>{
                expect(res.body.text).toBe(text);
               })
            .end((err, res)=>{
                if(err) {
                    return done(err);
                }
                Todo.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e)=> done(e));
        });
    });

     it('should create a new test with invalid data',(done)=>{

         request(app)
         .post('/todos')
         .send({})
         .expect(400)
         .end((err, res)=>{
            if (err) {
                return done(err);
            }
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
     }).catch((e)=> done(e));
        });
     });
});

describe('GET  /todos',()=>{
    it('should get all todos',(done)=>{
       request(app)
           .get('/todos')
           .expect(200)
           .expect((res)=>{
                expect(res.body.todos.length).toBe(2);

            })
            .end(done);
    });
});

describe('GET /todos/:id',()=> {
    it('should return todo doc',(done)=>{
       request(app)
           .get(`/todos/${todos[0]._id.toHexString()}`)
           .expect(200)
           .expect((res)=>{
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
    it('should return 404 if no todo found!',(done)=>{
        var hexId = new ObjectID().toHexString();
        request(app)
        .get(`/todos/${hexId}`)
            .expect(404)
            .end(done);
    });
    it('should return for non-object id',(done)=>{
        request(app)
            .get('/todos/123abc')
            .expect(404)
            .end(done);
    });
});
describe('Delete test todo/id',()=>{
    it('Should delete a todo',(done)=> {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res)=>{
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then((todo)=>{
                    expect(todo).toBe(null);
                    done();
                }).catch((err)=> done(err));

            });
    });
    it('Should send 404 error if todo not found', (done)=> {
        var hexId = new ObjectID().toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(404)
            .end(done);

    });
    it('should send 404  for non-object id',(done)=>{
        request(app)
            .delete('/todos/123abc')
            .expect(404)
            .end(done);
    });
});