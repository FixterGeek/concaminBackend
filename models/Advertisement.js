const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const advertisementSchema = new Schema({
    title:String,
    body:String,
    image:String,
    link:String,
    toPublish:{
        type:Boolean,
        default:false
    }
},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
})


module.exports = mongoose.model('Advertisement', advertisementSchema);


