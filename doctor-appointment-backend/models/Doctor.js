const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
    {
        firstName:{type:String , required:true},
        lastName:{type:String , required:true},
        email :{ type:String , required:true , unique:true},
        password :{type:String , required:true},
        phone :{type:Number , required:true},
        age:{type:Number , required:true},
        experience:{type:Number},
        consultationFee:{type:Number},
        specialization: {
        type: String,
        required: true,
                enum: [
        "General Physician",        // Fever, cold, cough, body pain – first level doctor
        "Family Medicine",         // Whole family general healthcare
        "Internal Medicine",       // Adult diseases, chronic problems

        "Cardiologist",            // Heart, BP, chest pain
        "Neurologist",             // Brain, nerves, headache, seizures
        "Neurosurgeon",            // Brain / spine surgery

        "Pulmonologist",           // Lungs, breathing, asthma, TB

        "Hepatologist",            // Liver, jaundice, hepatitis
        "Nephrologist",            // Kidney, dialysis, creatinine
        "Urologist",               // Urine, bladder, prostate, kidney stones

        "Orthopedic Surgeon",      // Bones, joints, fractures
        "Rheumatologist",          // Arthritis, joint pain, autoimmune

        "Gynecologist",            // Women health, pregnancy, periods
        "Pediatrician",            // Children & newborn care

        "Psychiatrist",            // Mental illness, depression, anxiety (with medicines)
        "Psychologist",            // Counseling, therapy, behavior issues

        "Ophthalmologist",         // Eyes, vision, cataract
        "ENT Specialist",          // Ear, nose, throat problems

        "Dermatologist",           // Skin, hair, acne, allergy
        "Dentist",                 // Teeth, gums, dental pain

        "General Surgeon",         // General operations, appendix, hernia
        "Oncologist",             // Cancer treatment

        "Endocrinologist",         // Diabetes, thyroid, hormones
        "Hematologist",           // Blood diseases, anemia

        "Infectious Disease Specialist", // Infections, viral, bacterial, COVID

        "Emergency Medicine",      // Accidents, trauma, urgent care
        "Pain Management",         // Chronic pain, back pain, nerve pain
        "Physiotherapist",        // Physical therapy, rehab, movement recovery
        "Radiologist"             // X-ray, CT scan, MRI reports
        ]

        },
        approved: { type: Boolean, default: false },
        role : {type:String , default: "doctor"},
        profilePhoto: { type: String, default: null },
        availability:[
            {
                // day:{
                //     type:String,
                //     enum:[
                //         "Monday",
                //         "Tuesday",
                //         "Wednesday",
                //         "Thursday",
                //         "Friday",
                //         "Saturday",
                //         "Sunday"
                //     ]
                // },
                date:{type:Date, required:true},
                slots:[
                    {
                        start:String,
                        end:String,
                        isAvailable:{type:Boolean , default:true},
                        status: {
                        type: String,
                        enum: ["available", "booked", "rejected"],
                        default: "available"
                        }
                    }
                ],
                duration:{
                    type:Number,
                    enum:[
                        15,
                        30,
                        45
                    ]
                }
            }
        ]

    },
     { timestamps: true }
);

// Helpful indexes for common queries
DoctorSchema.index({ email: 1 });
DoctorSchema.index({ specialization: 1, approved: 1 });
DoctorSchema.index({ approved: 1, createdAt: -1 });

module.exports = mongoose.model("Doctor" ,DoctorSchema);