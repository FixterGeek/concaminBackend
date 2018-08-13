const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
    tipo:{
        type:String,
        enum:["EDU", "PRO"],
        default:"PRO"
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    university:{
        type:String,
        required:true
    },
    position:String,
    company: String,
    from:{
        type: Date
    },
    to:{
        type: Date
    },
    picture:String,
    links:[String]

},{
    timestamps:{
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
});


module.exports = mongoose.model('Skill', skillSchema);