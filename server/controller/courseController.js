const Course = require('../model/courseSchema')
const ErrorHandler = require('../utlis/ErrorHandler')
const catchAsync = require('../middleware/catchAsyncError')
const Department = require("../model/departmentSchema");

// save course
exports.saveCourse = catchAsync(async (req, res, next) => {
    try {
        const { courseCode, department } = req.body;
        const courseExists = await Course.findOne({ courseCode: courseCode });
        const existingDepartment = await Department.findOne({ _id: department })

        if (courseExists) {
            return next(new ErrorHandler('Course already exists', 404));
        }
        if (!existingDepartment) {
            return next(new ErrorHandler('Department not found', 404));
        }

        const course = await Course.create(req.body)
        res.status(201).json({
            success: true,
            course,
            message: 'Course Added successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
});

// get all courses
exports.getCourses = catchAsync(async (req, res) => {
    const courses = await Course.find().populate('department', 'name')
    res.status(200).json({
        success: true,
        courses
    })
})

// for get courses by department
exports.getCoursesByDepartment = catchAsync(async (req, res, next) => {
    const department = req.query.department
    if (!department) {
        return next(new ErrorHandler('Department not founded', 404));
    }
    const courses = await Course.find({ department: department }).populate('department', 'name')
    if (!courses) {
        return next(new ErrorHandler('Courses not founded', 404));
    }
    res.status(200).json({
        success: true,
        courses
    })
})