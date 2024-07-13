const mongoose = require('mongoose');

const offerCourseDetailsSchema = new mongoose.Schema({
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        required: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    courses: [
        {
            classRoom: {
                type: String,
                required: true,
                ref: 'Classroom'
            },
            labRoom: {
                type: String,
                ref: 'Classroom'
            },
            facultyName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Faculty',
                required: true
            },
            courseName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
                required: true
            },
            seat: {
                type: Number,
                required: true
            },
            section: {
                type: Number,
                required: true
            },
            classTime: {
                type: String,
                required: true
            },
            labTime: {
                type: String
            }
        }
    ]
});
module.exports = mongoose.model('OfferCourseDetails', offerCourseDetailsSchema);