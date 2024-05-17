const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const validationSchema = new Schema({
    Name: {
        type: String
    },
    Email: {
        type: String
    },
    Password: {
        type: String
    },
    ConfirmPassword: {
        type: String
    },
    Gender:{
        type:String
    },
    Role:{
        type:String
    },
    Image:{
        type:String
    },
    Specialization: {
        type: String // Field for Doctor's specialization
    },
    Experience: {
        type: Number // Field for Doctor's experience (in years)
    },
    Qualifications: {
        type: String // Field for Doctor's qualifications
    },
    Insurance: {
        type: String // Field for Insurance accepted by Doctor
    },
    timeSlot: [{
        day: {
            type: String // Day of the week (e.g., Monday, Tuesday)
        },
        startTime: {
            type: String // Start time of the time slot (e.g., "09:00 AM")
        },
        endTime: {
            type: String // End time of the time slot (e.g., "11:00 AM")
        }
    }]
}, { timestamps: true });

const validation = mongoose.model('validate', validationSchema);

module.exports = validation;
