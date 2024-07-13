const Faculty = require('../model/facultySchema');
const Student = require('../model/studentSchema');
const Admin = require('../model/adminSchema');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const sendToken = require("../utils/sendToken");
const { compare } = require("bcrypt");


exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    try {
        let user;
        user = await Student.findOne({ email }).select('+password');
        if (user) {
            const isMatch = await compare(password, user.password);
            if (isMatch) {
                return sendToken(user, 200, res);
            }
        }
        user = await Faculty.findOne({ email }).select('+password');
        if (user) {
            const isMatch = await compare(password, user.password);
            if (isMatch) {
                return sendToken(user, 200, res);
            }
        }
        user = await Admin.findOne({ email }).select('+password');
        if (user) {
            const isMatch = await compare(password, user.password);
            if (isMatch) {
                return sendToken(user, 200, res);
            }
        }
        return next(new ErrorHandler('Invalid credentials', 401))
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

exports.logout = catchAsyncError(async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        message: 'Logged out successfully',
    });
});