// load dependencies
const mongoose = require('mongoose');

// connect to database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Student');

// create model
var student = mongoose.model('student',{
   studentID:{
       type: Number,
       required: true,
       trim: true,
       minlength:1
   },
   studentName: {
       type: String,
       required: true,
       trim: true,
       minlength: 1
   },
   course: {
       type: String,
       required: true,
       minlength:1,
       trim: true
   }
});

// create constructor
var user1 = new student({studentID:1, studentName: "Anki Reddy"});

// save data to database
user1.save().then((doc)=>{
    console.log('User saved',doc);
},(err)=>{
    console.log('Unable to insert user1',err);
});