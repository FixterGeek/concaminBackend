const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    participants:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    startDate:{
        type:Date,
        required:"necesitas proporcionar una fecha de inicio"
    },
    endDate:{
        type:Date,
        required:"necesitas proporcionar una fecha de finalización"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    cover:String,
    image:String,
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


module.exports = mongoose.model('Event', eventSchema);