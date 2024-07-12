const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        }
    ],
    faculties: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Faculty',
        }
    ],
    createAt: {
        type: Date,
        default: Date.now
    }
});


const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
