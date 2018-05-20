const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    tipo:{
        type:String,
        enum:["GROUP", "EVENT", "PERSONAL", "INSTITUTION"],
        default:"PERSONAL"
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    body:{
        type:String
    },
    file:String,
    links:[String],
    image:String,
    tags:[{
        type:String
    }],
    comments:[{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }],
    love:{
        type:Number,
        default:0
    }

},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
});


module.exports = mongoose.model('Post', postSchema);