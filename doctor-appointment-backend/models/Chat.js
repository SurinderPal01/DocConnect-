const mongoose = require("mongoose");

const ChatSchema =  mongoose.Schema({
    appointment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required:true,
        index:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        refPath :"senderModel",
        required:true
    },
    senderModel:{
        type:String,
        enum:[
            "User","Doctor"
        ]
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    message:{
        type:String,
        required:true,
        trim:true
    },
    type:{
        type:String,
        enum:["text","image","file"],
        default:"text"
    },
    isRead:{
        type:Boolean,
        default:false
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("Chat",ChatSchema);