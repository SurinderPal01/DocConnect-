const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },  
    recipientModel:{
        type:String,
        enum: ["User","Doctor"],
        required:true
    },
    appointment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Appointment",
        required:true
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Doctor",
        required:true
    },
    // type:{
    //     type:String,
    //     enum:[
    //         "booked",
    //         "approved",
    //         "rejected",
    //         "cancelled",
    //         "completed"
    //     ],
    //     required:true
    // },
    title:String,
    message:String,

    link:String, // front-end redirect 
    isRead:{
        type:Boolean,
        default:false
    }
},
{ timestamps:true});

// Indexes for faster notification lookups
NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model("Notification", NotificationSchema);