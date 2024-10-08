const OfferCourseDetails = require('../model/offerCourseDetailsSchema');
const OfferCourse = require('../model/offerCourseSchema');
const Semester = require('../model/semesterSchema');
const Department = require('../model/departmentSchema');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
// post offerCourses
exports.offerCourse = catchAsyncError(async (req, res, next) => {
    const { semester, department, courses } = req.body;

    try {
        const semesterExists = await Semester.findById(semester);
        if (!semesterExists) {
            return next(new ErrorHandler('No such semester found', 404));
        }
        const departmentExists = await Department.findById(department);
        if (!departmentExists) {
            return next(new ErrorHandler('No such department found', 404));
        }

        const savedOfferCourses = [];
        const skippedCourses = [];

        for (let courseData of courses) {
            const existingCourse = await OfferCourse.findOne({
                facultyName: courseData.facultyName, // Check facultyName too
                courseName: courseData.courseName,
                section: courseData.section
            });

            if (!existingCourse) {
                const newOfferCourse = new OfferCourse({
                    ...courseData,
                    semester,
                    department
                });
                savedOfferCourses.push(await newOfferCourse.save());
            } else {
                skippedCourses.push(courseData.courseName);
                savedOfferCourses.push(existingCourse);
            }
        }

        let offerCourseDetails = await OfferCourseDetails.findOne({ department, semester });

        if (!offerCourseDetails) {
            offerCourseDetails = new OfferCourseDetails({
                semester,
                department,
                courses: savedOfferCourses.map(course => course._id)
            });
        } else {
            // Check for existing course IDs to avoid duplication
            const existingCourseIds = new Set(offerCourseDetails.courses.map(course => course.toString()));
            const newCourseIds = savedOfferCourses.map(course => course._id.toString());
            offerCourseDetails.courses = [...existingCourseIds, ...newCourseIds].filter(id => id);
        }

        await offerCourseDetails.save();

        await Semester.findByIdAndUpdate(
            semester,
            { $addToSet: { offerCourses: offerCourseDetails._id } },
            { new: true }
        );

        let message = 'All courses added successfully';
        if (skippedCourses.length > 0) {
            message = `Some courses were skipped as they already exist: ${skippedCourses.join(', ')}`;
        }
        res.status(200).json({
            status: 'success',
            data: {
                offerCourseDetails
            },
            message
        });

    } catch (error) {
        console.error('Error in offerCourses:', error);
        return next(new ErrorHandler('Internal Server Error', 500));
    }
});
// get offerCourses By semester and department (Admin Access)
exports.getOfferCourses = catchAsyncError(async (req, res, next) => {
    const { semesterId, departmentId } = req.query;
    const offerCourseDetails = await OfferCourseDetails.findOne({
        semester: semesterId,
        department: departmentId
    }).populate({
        path: 'courses',
        populate: [
            { path: 'courseName', select: 'courseCode' },
            { path: 'facultyName', select: 'name' },
            { path: 'classRoom', select: 'building classroomNo' },
            { path: 'labRoom', select: 'building classroomNo' },
        ]
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
