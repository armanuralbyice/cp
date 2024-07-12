const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        unique: true
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Department'
    },
    credit: {
        type: String,
        required: true
    },

})
module.exports = mongoose.model('Course', courseSchema);