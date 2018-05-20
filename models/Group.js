const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    members:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    cover:String,
    logo:String,
    posts:[{
        type:Schema.Types.ObjectId,
        ref:'Post'
    }]

},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
});


module.exports = mongoose.model('Group', groupSchema);