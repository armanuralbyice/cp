const express = require('express');

const { authenticateRegister, authorizeRegisterRoles } = require('../middleware/auth');
const { saveStudent, getAllStudents, getStudentsByDepartment, getStudentByID } = require('../controller/studentController');

const router = express.Router();

router.use(authenticateRegister)
router.use(authorizeRegisterRoles)

router.route('/student/save').post(saveStudent)
router.route('/department/:name/students').get(getStudentsByDepartment)
router.route('/students/all').get(getAllStudents)
router.route('/student/:studentID').get(getStudentByID)
// router.route('/delete/student/:studentID').delete(deleteStudent)

module.exports = router;