const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema(
    {
        name: {
            type:String,
            required:true,
            trim:true
        },
        specialization: {
            type: String,
            required: true,
            trim: true
        },
        phone: {
            type:String,
            trim: true
        },
        
        availableDays: {
            type: [string],
            trim: true
        },
        {
            timestamps: true
        }


);

module.exports = mongoose.model("Doctor",doctorSchema);