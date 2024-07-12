const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const Department = require("./departmentSchema");
const studentSchema = new mongoose.Schema({
    studentID: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        presentAddress: {
            district: {
                type: String,
                required: true
            },
            thana: {
                type: String,
                required: true
            },
            postCode: {
                type: String,
                required: true
            }
        },
        permanentAddress: {
            district: {
                type: String,
                required: true
            },
            thana: {
                type: String,
                required: true
            },
            postCode: {
                type: String,
                required: true
            }
        }
    },
    role: {
        type: String,
        default: 'student'
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Department'
    },
    dateOfBirth: {
        type: Date,
        match: /^\d{4}-\d{2}-\d{2}$/,
        required: true
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Semester'
    },
    password: {
        type: String,
        select: false,
    }
})
studentSchema.pre('save', async function (next) {
    if (this.role) {
        const year = new Date().getFullYear().toString()
        const semesterMap = {
            'spring': '1',
            'summer': '2',
            'fall': '3'
        }
        const semesterPart = semesterMap[this['semester']] || '1'
        const departmentMap = {
            'CSE': '50',
            'EEE': '60',
            'GEB': '40',
            'PHARMACY': '30',
            'CIVIL': '20',
            'ECONOMIC': '10',
            'ENGLISH': '70',
            'BBA': '90'
        };
        const department = await Department.findById(this.department);
        const departmentPart = department ? departmentMap[department.name] : '00';
        // Find the highest existing student ID in the same year, semester, and department
        const existingStudent = await this.constructor.findOne({
            studentID: new RegExp(`^${year}${semesterPart}${departmentPart}`, 'i')
        }, 'studentID').sort('-studentID');

        // Calculate the serial part of the student ID
        const serialPart = existingStudent ? (parseInt(existingStudent.studentID.slice(-3)) + 1).toString().padStart(3, '0') : '001';

        // Create the full student ID
        this.studentID = `${year}${semesterPart}${departmentPart}${serialPart}`;
    }
    else {
        this.studentID = null;
    }
    next()
})
studentSchema.methods.comparePassword = async function (enterPassword) {
    const hashedPassword = this.password || ''
    return await bcrypt.compare(enterPassword, hashedPassword);
}

studentSchema.methods.getJwtToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}
module.exports = mongoose.model('Student', studentSchema);