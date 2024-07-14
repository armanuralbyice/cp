const express = require('express');
const {  getCourses, getCoursesByDepartment, saveCourse } = require("../controller/courseController");
const { authenticateRegister, authorizeRegisterRoles } = require("../middleware/auth");


const router = express.Router();

router.use(authenticateRegister)
router.use(authorizeRegisterRoles)
router.route('/save').post(saveCourse)
router.route('/all').get(getCourses);
router.route('/filter').get(getCoursesByDepartment);



module.exports = router;