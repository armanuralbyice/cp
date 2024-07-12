const mongoose = require('mongoose')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
    adminID: {
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
        default: 'admin'
    },
    password: {
        type: String,
        select: false
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Department',
    },
    dateOfBirth: {
        type: String,
        match: /^\d{4}-\d{2}-\d{2}$/,
        required: true
    },
})
adminSchema.pre('save', async function (next) {
    if (this.role) {
        const departmentMap = {
            'ICS': '100'
        };
        const departmentPart = departmentMap[this['department']] || '100';

        const existingFaculty = await this.constructor.findOne({
            adminID: new RegExp(`^${departmentPart}`, 'i')
        }, 'adminID').sort('-adminID');

        const serialPart = existingFaculty ? (parseInt(existingFaculty.adminID.slice(-3)) + 1).toString().padStart(3, '0') : '001';


        this.adminID = `${departmentPart}${serialPart}`;
    } else {
        this.adminID = null;
    }

    next()

})
adminSchema.methods.comparePassword = async function (enterPassword) {
    const hashedPassword = this.password || ''
    return await bcrypt.compare(enterPassword, hashedPassword);
}
adminSchema.methods.getJwtToken = async function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}
module.exports = mongoose.model('Admin', adminSchema);