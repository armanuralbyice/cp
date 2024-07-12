const Student = require('../model/studentSchema')
const Department = require('../model/departmentSchema')
const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utlis/ErrorHandler')
const { addStudentAndSendEmail } = require("../middleware/sendEmail");

// save student
exports.saveStudent = catchAsyncError(async (req, res, next) => {
    try {
        const emailExists = await Student.findOne({ email: req.body.email })
        if (emailExists) {
            return next(new ErrorHandler('Email already exist', 400));
        }
        await addStudentAndSendEmail(req, res, next)
    } catch (err) {
        next(new ErrorHandler('Internal Server Error', 500))
    }
})

// get all students
exports.getAllStudents = catchAsyncError(async (req, res, next) => {
    try {
        const students = await Student.find().populate('department', 'name');
        res.status(200).json({
            status: 'success',
            students,
        });
    } catch (err) {
        next(new ErrorHandler('Internal Server Error', 500))
    }

})

// get students by department
exports.getStudentsByDepartment = catchAsyncError(async (req, res, next) => {
    const departmentName = req.params.name
    try {
        const department = await Department.findOne({ name: departmentName }).populate({
            path: 'students',
            populate: { path: 'department', select: 'name' }
        });
        if (!department) {
            return next(new ErrorHandler('Department not founded', 404))
        }
        const students = department.students
        if (!students || students.length === 0) {
            return next(new ErrorHandler('No students found for the department', 404));
        }
        res.status(201).json({
            status: 'success',
            students,
            department: department
        })
    } catch (err) {
        next(new ErrorHandler('Internal Server Error', 500))
    }
})

// get student by studentID
exports.getStudentByID = catchAsyncError(async (req, res, next) => {
    const studentID = req.params.studentID
    try {
        const student = await Student.findOne({ studentID: studentID })
        if (!student) {
            return next(new ErrorHandler('student not founded', 404))
        }
        res.status(200).json({
            status: 'success',
            student
        })
    }
    catch (err) {
        next(new ErrorHandler('Internal Server Error', 500))
    }

})