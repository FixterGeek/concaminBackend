const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    profilePic:String,
    name:String,
    surName:String,
    lastName:String,
    birthday:Date,
    skills:[
        {
            type:Schema.Types.ObjectId,
            ref:"Skill"
        }
    ],
    posts:[
        {
            type:Schema.Types.ObjectId,
            ref:"Post"
        }
    ],
    followers:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    institution:{
        type:Schema.Types.ObjectId,
        ref:'Institution'
    }

},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
});

userSchema.plugin(passportLocalMongoose, {usernameField:'email'});

module.exports = mongoose.model('User', userSchema);