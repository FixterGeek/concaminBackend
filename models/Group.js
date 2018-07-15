const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    name:{
        type:String,
        required:true
    },
    subject:String,
    description:{
        type:String
    },
    cover:String,
    logo:String,
    posts:[{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }],
    revision:{
        type: Boolean,
        default: true
    }

},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
});


module.exports = mongoose.model('Group', groupSchema);