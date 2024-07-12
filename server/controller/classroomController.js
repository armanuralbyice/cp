
const Classroom = require("../model/classroomSchema");
const ErrorHandler = require("../utlis/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// save classroom
exports.saveClassroom = catchAsyncError(async (req, res, next) => {

    const { building, classroomNo } = req.body;
    const classroomExists = await Classroom.findOne({ classroomNo: classroomNo, building: building });
    if (classroomExists) {
        return next(new ErrorHandler('Room already exists', 404));
    }
    const classroom = await Classroom.create(req.body)
    res.status(201).json({
        success: true,
        classroom,
        message: 'Classroom Added successfully'
    });
})

// get all classrooms
exports.getAllClassrooms = catchAsyncError(async (req, res) => {
    const classrooms = await Classroom.find()
    res.status(200).json({
        success: true,
        classrooms
    })
})

// delete classroom
exports.deleteClassroom = catchAsyncError(async (req, res, next) => {
    const classroom = await Classroom.findByIdAndDelete(req.params.id);
    if (!classroom) {
        return res.status(404).json({ message: 'Semester not found' });
    }
    res.status(200).json({
        status: 'success',
        message: 'classroom deleted successfully'
    });
})