const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const institutionSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    logo:{
        type:String,
        required:"Debes incluir un logotipo"
    },
    description:{
        type:String
    },
    members:[{
        type:Schema.Types.ObjectId,
        ref:"User"
    }],
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


module.exports = mongoose.model('Institution', institutionSchema);