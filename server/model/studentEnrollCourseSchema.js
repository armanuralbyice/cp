const mongoose = require('mongoose');
const OfferCourse = require('./offerCourseDetailsSchema');

const courseEnrollSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
    },
    enrollCourses: [
        {
            course: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'OfferCourseDetails'
            },
            marks: {
                mid1: {
                    type: Number,
                    default: 0,
                },
                mid2: {
                    type: Number,
                    default: 0,
                },
                final: {
                    type: Number,
                    default: 0,
                },
                assignment: {
                    type: Number,
                    default: 0,
                }
            }
        }
    ]
});
courseEnrollSchema.pre('save', async function (next) {
    try {
        const session = await mongoose.startSession();
        session.startTransaction();

        for (const enrolledCourse of this.enrollCourses) {
            const course = await OfferCourse.findById(enrolledCourse.course).session(session);
            if (!course) {
                throw new Error(`Course not found for id ${enrolledCourse.course}`);
            }
            if (course.seat > 0) {
                course.seat--;
                await course.save({ session });
            } else {
                await session.abortTransaction();
                await session.endSession();
                throw new Error(`No seats available for course ${course._id}`);
            }
        }

        await session.commitTransaction();
        await session.endSession();
        next();
    } catch (error) {
        next(error);
    }
});


module.exports = mongoose.model('CourseEnroll', courseEnrollSchema);
