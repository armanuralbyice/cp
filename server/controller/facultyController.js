const Faculty = require('../model/facultySchema')
const Department = require('../model/departmentSchema')
const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utils/ErrorHandler')
const { addFacultyAndSendEmail } = require("../middleware/sendEmail");


// save Faculty
exports.saveFaculty = catchAsyncError(async (req, res, next) => {
    const emailExists = await Faculty.findOne({ email: req.body.email });

    if (emailExists) {
        return res.status(400).json({
            success: false,
            message: 'Email already exists.',
        });
    }
    await addFacultyAndSendEmail(req, res, next);
})

// get all faculties
exports.getAllFaculties = catchAsyncError(async (req, res, next) => {
    const faculties = await Faculty.find().populate('department', 'name');
    res.status(200).json({
        status: 'success',
        faculties
    })
})

// get faculties by department
exports.getFacultiesByDepartment = catchAsyncError(async (req, res, next) => {
    const { departmentId } = req.params
    const department = await Department.findOne({ _id: departmentId }).populate('faculties');
    if (!department) {
        return next(new ErrorHandler('Department not found', 404));
    }

    const faculties = department.faculties;
    if (!faculties || faculties.length === 0) {
        return next(new ErrorHandler('No faculties found for the department', 404));
    }

    res.status(200).json({
        status: 'success',
        faculties
    });
});


// get faculty by facultyID
exports.getFacultyByID = catchAsyncError(async (req, res, next) => {
    const facultyID = req.params.facultyID
    const faculty = await Faculty.findOne({ facultyID: facultyID })
    if (!faculty) {
        return next(new ErrorHandler('Faculty not founded', 404))
    }
    res.status(200).json({
        status: 'success',
        faculty
    })
})