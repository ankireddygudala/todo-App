var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');
const bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        trim:true,
        unique: true,
        validate: {
            isAsync: true,
            validator: validator.isEmail,
            message: '{VALUE} not valid email!'
        }
    },
    name: {
        type: String,
        required:true,
        minlength:1,
        trim:true
    },
    password: {
        type :String,
        required: true,
        minlength:1
    },
    tokens: [{
        access: {
            type: String,
            required: true

        },
        token: {
            type: String,
            required: true

        }
    }]
});

userSchema.methods.toJSON = function () {
    var user = this;
    userObject = user.toObject();

    return _.pick(userObject,['name','email']);

};

userSchema.methods.generateAuthToken = function () {
    var user = this;
    var access ='Auth';
    var token = jwt.sign({_id: user._id.toString(), access}, 'abc123').toString();

    user.tokens.push({access,token});
    return user.save().then(()=>{
        return token;
    });
};

userSchema.statics.findByToken =function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token,'abc123');
    }catch (e){
        return Promise.reject();
    }
    return User.find({
       _id:decoded._id,
        'tokens.token': token,
        'tokens.access': 'Auth'
    });

};

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')){
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(user.password, salt, (err, hash) =>{
                user.password = hash;
                next();
        });
        });
    }
    else{
        next();
    }

});

var User = mongoose.model('User',userSchema);

module.exports = {User};