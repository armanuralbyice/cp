const express = require('express');
const { enrollCourse, getOfferCoursesByAdvising, deleteEnrollCourseById, getAdvisingCourses } = require("../controller/advisingController");
const { authenticateStudent, authorizeStudentRoles } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateStudent)
router.use(authorizeStudentRoles)

router.route('/offerCourses').get(getOfferCoursesByAdvising)
router.route('/course').get(getAdvisingCourses)
router.route('/').post(enrollCourse)
router.route('/course/delete/:courseId').delete(deleteEnrollCourseById)

module.exports = router;