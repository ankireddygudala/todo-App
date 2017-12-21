var mongoose = require('mongoose');

var User = mongoose.model('User',{
   userID: {
       type: String,
       required: true,
       minlength: 1,
       trim: true
   },
   name: {
       type: String,
       required: true,
       minlength: 1,
       trim: true
   },
   email: {
       type: String,
       trim: true
   }
});

module.exports = {User};