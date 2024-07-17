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
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfferCourse',
    }]
});
module.exports = mongoose.model('OfferCourseDetails', offerCourseDetailsSchema);