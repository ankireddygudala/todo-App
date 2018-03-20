var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());

app.get('/',(req, res)=>{
    res.send('Welcome to Todo');
});

app.get('/todos',(req, res)=>{
   Todo.find().then((todos)=>{
       res.send({todos});
    },(err)=>{
        res.status(400).send(err);
    });
});

// get method by passing id
app.get('/todos/:id',(req, res)=>{
    var id = req.params.id;
    //if not objectid return error
    if (!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    // Find by id
    Todo.findById(id).then((todo)=>{
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch ((err)=>{
            return res.status(400).send();
    });
        //success
            // if todo send it back
            //if no todo send 404 error and empty body
        //if error
        //send 400 with empty body
});

app.post('/todos',(req, res)=>{
    var todo = new Todo({
        text: req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    },(err) =>{
        res.status(400).send(err);
	});
});-

app.delete('/todos/:id', (req, res)=>{
    var id = req.params.id;

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo)=>{
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    	}).catch((e)=>{
        res.status(400).send();
	});
});

app.patch('/todos/:id', (req, res)=>{
	var id = req.params.id;
	var body = _.pick(req.body,['text','completed']);

	if (!ObjectID.isValid(id)){
	    return res.status(404).send();
    }
    if(_.isBoolean(body.completed) && body.completed){
	    body.completedAt = new Date().getTime();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id,{ $set: body}, {new: true}).then((todo)=>{
        if(!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    })

});
app.get('/user/me', authenticate ,(req, res)=> {
    res.send(req.user);
});

app.post('/user', (req, res)=>{

	var body = _.pick(req.body,['email','name','password']);
	var user = new User(body);

	user.save().then(()=>{
		return user.generateAuthToken();

	}).then((token)=>{
	    res.header('x-auth',token).send(user);
    }).catch((e)=>{
		res.status(400).send(e);
	});

});


app.listen(3000,()=>{
   console.log('server started and listening on port 3000')
});

module.exports = {app};