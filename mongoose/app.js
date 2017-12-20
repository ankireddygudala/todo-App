const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

//creating model
var Todo = mongoose.model('Todo',{
   text:{
       type: String
   } ,
    completed: {
       type: Boolean
    },
    completedAt: {
       type: Number
    }
});

//create constructor

var newTodo = new Todo({text:'Welcome to do', completed: false});

//save to database

newTodo.save().then((doc)=>{
    console.log('Saved todo ',doc);
},(err)=>{
    console.log('Unable to insert! ',err);
});