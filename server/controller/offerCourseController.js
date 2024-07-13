const OfferCourseDetails = require('../model/offerCourseDetailsSchema');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');

// save offerCourses
exports.offerCourse = catchAsyncError(async (req, res, next) => {
    const { semester, department, courses } = req.body;

    try {
        const results = [];

        for (const course of courses) {
            const { courseName, section } = course;

            const existingCourse = await OfferCourseDetails.findOne({
                semester: semester,
                department: department,
                'courses.courseName': courseName,
                'courses.section': section
            });

            if (existingCourse) {
                results.push({
                    ...course,
                    exists: true,
                    message: `Course ${courseName} - Section ${section} already exists`
                });
                return next(new ErrorHandler('One or some courses already exists', 409))
            } else {
                const newCourse = {
                    ...course,
                    semester: semester,
                    department: department
                };
                await OfferCourseDetails.findOneAndUpdate(
                    { semester: semester, department: department },
                    { $push: { courses: newCourse } },
                    { upsert: true }
                );
                results.push({
                    ...course,
                    exists: false,
                    message: `Course ${courseName} - Section ${section} added`
                });
            }
        }
        return res.status(200).json({
            success: true,
            results
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// get offerCourses By semester and department
exports.getOfferCourses = catchAsyncError(async (req, res, next) => {
    const { semesterId, departmentId } = req.query;
    const offerCourseDetails = await OfferCourseDetails.findOne({
        semester: semesterId,
        department: departmentId
    })
    if (!offerCourseDetails) {
        return next(new ErrorHandler('No course details found for the specified semester and department', 404));
    }

    res.status(200).json({
        success: true,
        courses: offerCourseDetails.courses
    });
})

// delete offerCourses
exports.deleteOfferCourse = catchAsyncError(async (req, res, next) => {
    const { departmentId, semesterId, courseId } = req.query;

    try {
        const updatedOfferCourseDetails = await OfferCourseDetails.findOneAndUpdate(
            {
                semester: semesterId,
                department: departmentId
            },
            {
                $pull: { courses: courseId }
            },
            { new: true }
        );

        if (updatedOfferCourseDetails) {
            const deletedOfferCourse = await OfferCourse.findByIdAndDelete(courseId)

            if (!deletedOfferCourse) {
                return next(new ErrorHandler(`No OfferCourse document found with ID: ${courseId}`, 200))
            }
        }
        else {
            console.log(`No OfferCourseDetails document found for department ${departmentId} and semester ${semesterId}`);
        }

        res.status(200).json({
            status: 'success',
            message: 'Delete successfully'
        });
    } catch (error) {
        console.error('Error deleting offer course:', error);
        res.status(500).json({
            status: 'error',
            message: 'An error occurred while deleting the offer course'
        });
    }
});
