const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');

var app = express();

app.use(bodyParser.json());

app.get('/',(req, res)=>{
   res.send("Hello");
});

app.post('/todos',(req, res)=>{
   var todo = new Todo({
      text: req.body.text
   });
   // save to database
    todo.save().then((doc)=>{
        console.log('Todo inserted!');
        res.send(doc);
    },(err)=>{
        res.status(400).send(err);
});

});
app.listen(5050,()=>{
    console.log('Server listening on port 5050');
});

module.exports = {app};