const Department = require('../model/departmentSchema')
const catchAsyncError = require('../middleware/catchAsyncError')
const ErrorHandler = require('../utlis/ErrorHandler')

// save department
exports.saveDepartment = catchAsyncError(async (req, res, next) => {
    const { name } = req.body

    const existingDepartment = await Department.findOne({ name })
    if (existingDepartment) {
        return next(new ErrorHandler('Department already exists', 409))
    }
    const newDepartment = await new Department({
        name
    })
    const saveDepartment = await newDepartment.save()
    res.status(201).json({
        status: 'success',
        message: 'Department saved successfully.',
        saveDepartment
    });
})

// get all departments
exports.allDepartment = catchAsyncError(async (req, res, next) => {
    const department = await Department.find()
    res.status(200).json({
        status: 'success',
        department
    })
})

// delete department
exports.deleteDepartment = catchAsyncError(async (req, res, nest) => {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
        return res.status(404).json({ message: 'Department not found' });
    }
    res.status(200).json({
        status: 'success',
        message: 'Department deleted successfully'
    });
})