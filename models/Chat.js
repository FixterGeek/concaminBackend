const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    participants:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    messages:[{
        user:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        date:Date,
        body:String
    }]

},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
});


module.exports = mongoose.model('Chat', chatSchema);