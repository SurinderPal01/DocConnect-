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
        // start:{
        //     type:String,
        //     required:true
        // },
        // end:{
        //     type:String,
        //     required:true
        // },
        start:{
            type:Date,
            required:true,
        },
        end:{
            type:Date,
            required:true,
        },
        fee:{
            type: Number,
            required: true,
        },
        status:{
            type:String,
            enum:["pending","accepted","rejected","cancelled","completed"],
            default:"pending"
        },
        paymentStatus:{
            type:String, 
            enum:["NOT_ALLOWED","PENDING","PAID","FALIED"],
            default:"NOT_ALLOWED",
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

// Indexes to speed up common queries
AppointmentSchema.index({ user: 1, createdAt: -1 });
AppointmentSchema.index({ doctor: 1, createdAt: -1 });
AppointmentSchema.index({ doctor: 1, date: 1 });

module.exports = mongoose.model("Appointment",AppointmentSchema)