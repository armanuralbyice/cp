const mongoose = require('mongoose');
const CourseEnroll = require('../model/studentEnrollCourseSchema');
const Student = require('../model/studentSchema');
const Semester = require('../model/semesterSchema');
const OfferCourseDetails = require('../model/offerCourseDetailsSchema');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsync = require('../middleware/catchAsyncError');

// student course enroll.
exports.enrollCourse = catchAsync(async (req, res, next) => {
    const { courseId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler('Invalid courseId ObjectId', 400));
    }

    try {
        const studentId = req.user._id;
        const student = await Student.findById(studentId);

        // Fetch the latest semester
        const lastSemester = await Semester.findOne().sort({ createdAt: -1 }).exec();
        if (!lastSemester) {
            return next(new ErrorHandler('No semester found', 404));
        }
        const departmentOfferCourses = await OfferCourseDetails.findOne({
            semester: lastSemester._id,
            department: student.department
        })

        if (!departmentOfferCourses) {
            return next(new ErrorHandler('No courses offered for the student’s department', 404));
        }
        const courseExists = departmentOfferCourses.courses.includes(courseId);
        if (!courseExists) {
            return next(new ErrorHandler('Course not found in offered courses', 404));
        }
        let enrollment;
        const existingEnrollment = await CourseEnroll.findOne({ student: student._id });

        if (existingEnrollment) {
            if (existingEnrollment.semester.equals(lastSemester._id)) {
                if (existingEnrollment.enrollCourses.some(enrolledCourse => enrolledCourse.course.equals(courseId))) {
                    return next(new ErrorHandler('Course already enrolled', 400));
                } else {
                    existingEnrollment.enrollCourses.push({ course: courseId });
                    enrollment = await existingEnrollment.save();
                }
            } else {
                enrollment = new CourseEnroll({
                    student: studentId,
                    semester: lastSemester._id,
                    enrollCourses: [{ course: courseId }]
                });
                await enrollment.save();
            }
        } else {
            enrollment = new CourseEnroll({
                student: studentId,
                semester: lastSemester._id,
                enrollCourses: [{ course: courseId }]
            });
            await enrollment.save();
        }
        enrollment = await CourseEnroll.findById(enrollment._id).populate('enrollCourses.course');

        return res.status(200).json({ enrollCourse: enrollment });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// Get OfferCourses by advising
exports.getOfferCoursesByAdvising = catchAsync(async (req, res, next) => {
    const studentID = req.user._id;
    const student = await Student.findById(studentID);
    if (!student) {
        return next(new ErrorHandler('Student not found', 404));
    }

    const lastSemester = await Semester.findOne().sort({ createdAt: -1 }).exec();
    if (!lastSemester) {
        return next(new ErrorHandler('No semester found', 404));
    }
    const offerCourseDetails = await OfferCourseDetails.findOne({
        semester: lastSemester._id,
        department: student.department
    }).populate('courses.classRoom')
        .populate('courses.labRoom')
        .populate('courses.facultyName')
        .populate('courses.courseName');

    if (!offerCourseDetails) {
        return next(new ErrorHandler('No course details found for the specified semester and department', 404));
    }

    res.status(200).json({
        success: true,
        offerCourseDetails: offerCourseDetails
    });
})

// Delete enroll Course
exports.deleteEnrollCourseById = catchAsync(async (req, res, next) => {
    const studentID = req.user._id;
    const student = await Student.findById(studentID);

    if (!student) {
        return next(new ErrorHandler('Student not found', 404));
    }

    // Fetch the latest semester
    const lastSemester = await Semester.findOne().sort({ createdAt: -1 }).exec();
    if (!lastSemester) {
        return next(new ErrorHandler('No semester found', 404));
    }

    const { courseId } = req.params;
    console.log(`Received courseId: ${courseId}`);
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler('Invalid courseId ObjectId', 400));
    }
    const findCourse = await CourseEnroll.findOneAndUpdate(
        { 'enrollCourses.course': courseId },
        { $pull: { enrollCourses: { course: courseId } } },
        { new: true }
    );

    if (!findCourse) {
        return next(new ErrorHandler('Course not found', 404));
    }
    const course = await OfferCourseDetails.findById({ 'courses._id': courseId });
    if (course) {
        course.seat++;
        await course.save();
    }

    res.status(200).json({
        course,
        status: 'success',
        message: 'Delete successfully'
    });
});