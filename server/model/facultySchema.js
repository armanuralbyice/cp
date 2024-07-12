const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Department = require("./departmentSchema");

const facultySchema = new mongoose.Schema({
    facultyID: {
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
    password: {
        type: String,
        select: false
    },
    role: {
        type: String,
        default: 'faculty'
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Department'
    },
    dateOfBirth: {
        type: String,
        match: /^\d{4}-\d{2}-\d{2}$/,
        required: true
    },
})
facultySchema.pre('save', async function (next) {
    if (this.role) {
        const departmentMap = {
            'CSE': '50',
            'EEE': '60',
            'GEB': '40',
            'PHARMACY': '30',
            'CIVIL': '20',
            'ECONOMIC': '10',
            'ENGLISH': '70',
        };
        const department = await Department.findById(this.department);
        const departmentPart = department ? departmentMap[department.name] : '00';

        const existingFaculty = await this.constructor.findOne({
            facultyID: new RegExp(`^${departmentPart}`, 'i')
        }, 'facultyID').sort('-facultyID');

        const serialPart = existingFaculty ? (parseInt(existingFaculty.facultyID.slice(-3)) + 1).toString().padStart(3, '0') : '001';


        this.facultyID = `${departmentPart}${serialPart}`;
    } else {
        this.facultyID = null;
    }

    next()

})
facultySchema.methods.comparePassword = async function (enterPassword) {
    const hashedPassword = this.password || ''
    return await bcrypt.compare(enterPassword, hashedPassword);
}
facultySchema.methods.getJwtToken = async function () {
    return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}
module.exports = mongoose.model('Faculty', facultySchema);