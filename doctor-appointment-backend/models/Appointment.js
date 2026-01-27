const mongoose = require("mongoose");

const AppointmentSchema = mongoose.Schema(
    {
        doctor:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Doctor",
            required:true
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        // day:{
        //     type:String,
        //     required:true
        // },
        slotId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true
            },
        date:{
            type:Date,
            requied:true
        },
        start:{
            type:String,
            required:true
        },
        end:{
            type:String,
            required:true
        },
        status:{
            type:String,
            enum:["pending","accepted","rejected","cancelled","completed"],
            default:"pending"
        },
        statusHistory:{
            type:[
            {
                status:  String,
                at:{type:Date ,default:Date.now}
            }
            ],
            default:[]
        },
        cancelReason : String,
    },
    {timestamps:true}
);
module.exports = mongoose.model("Appointment",AppointmentSchema)