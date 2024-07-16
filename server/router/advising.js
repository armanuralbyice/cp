const express = require('express');
const { enrollCourse, getOfferCoursesByAdvising, deleteEnrollCourseById } = require("../controller/advisingController");
const { authenticateStudent, authorizeStudentRoles } = require("../middleware/auth");

const router = express.Router();

router.use(authorizeStudentRoles)
router.use(authenticateStudent)

router.route('/offerCourses').get(getOfferCoursesByAdvising)
router.route('/').post(enrollCourse)
router.route('/course/delete/:courseId').delete(deleteEnrollCourseById)

module.exports = router;