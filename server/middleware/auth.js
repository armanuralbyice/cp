const jwt = require('jsonwebtoken');
const Student = require('../model/studentSchema');
const Faculty = require('../model/facultySchema');
const Admin = require('../model/adminSchema');
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require('../middleware/catchAsyncError')

exports.authenticateUser = (model) => catchAsyncError(async (req, res, next) => {
    try {
        // const { token } = await req.cookies;
        // if (!token) {
        //     return next(new ErrorHandler('Not authorized to access this route, Login first', 401));
        // }
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return next(new ErrorHandler('Not authorized to access this route, Login first', 401));
        }
        const tokenStr = token.split(' ')[1];
        const decoded = jwt.verify(tokenStr, process.env.JWT_SECRET);
        req.user = await model.findById(decoded.id);
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new ErrorHandler('Invalid token', 401));
        } else if (error.name === 'TokenExpiredError') {
            return next(new ErrorHandler('Token expired, please login again', 401));
        } else {
            return next(new ErrorHandler('Internal Server Error', 500));
        }
    }
});
exports.authorizeUserRoles = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ErrorHandler('Not authorized to access this route', 401));
    }
    next();
};

exports.authenticateStudent = exports.authenticateUser(Student);
exports.authorizeStudentRoles = exports.authorizeUserRoles('student');


exports.authenticateRegister = exports.authenticateUser(Admin);
exports.authorizeRegisterRoles = exports.authorizeUserRoles('admin');


exports.authenticateFaculty = exports.authenticateUser(Faculty);
exports.authorizeFacultyRoles = exports.authorizeUserRoles('faculty');