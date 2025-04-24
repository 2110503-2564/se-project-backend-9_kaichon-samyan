const mongoose =  require('mongoose');

//add bcrypt to manage the password
const bcrypt = require('bcryptjs');

//add jwt 
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    name : {
        type : String , 
        required : [ true , 'Please add a name']
    },
    email : {
        type : String  , 
        required : [true , 'Please add an email'] , 
        unique : true , 
        match : [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
            , 'Please add a valid email'
        ]
    },
    tel : {
        type : String ,
        required : [true, 'Please add a tel'] ,
        unique : true ,
        match : [/^\d{3}-\d{3}-\d{4}$/, 'Please add a valid tel']
    },
    role : {
        type : String , 
        enum : ['user' , 'admin'] , 
        default : 'user'
    },
    password : {
        type : String , 
        required : [true , 'Please add a password'] ,
        minlength : 6 ,
        select : false
    },
    profileImg: {
        type: String,
        default: ""
    },
    username: {
        type: String,
        default: ""
    },
    resetPasswordToken : String ,
    resetPasswordExpire : Date ,
    createdAt :  {
        type : Date , 
        default : Date.now
    }
});

UserSchema.pre('save' , async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
});

//Sign JWT and return --> เอาไว้สรา้ง method ให้กับ user schema 
UserSchema.methods.getSignedJwtToken=function(){
    return jwt.sign({id : this._id} , process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    });
}
//Match user entered password to hashed password in database
UserSchema.methods.matchPassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password);
}

module.exports = mongoose.model('User' , UserSchema);