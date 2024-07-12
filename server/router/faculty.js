const express = require('express');
const { saveFaculty, getAllFaculties, getFacultyByID, getFacultiesByDepartment } = require("../controller/facultyController");
//const { authenticateRegister, authorizeRegisterRoles } = require("../middleware/auth");

const router = express.Router();

// router.use(authenticateRegister)
// router.use(authorizeRegisterRoles)
router.route('/faculty/save').post(saveFaculty)
router.route('/department/:departmentId/faculties').get(getFacultiesByDepartment)
router.route('/faculties/all').get(getAllFaculties)
router.route('/faculty/:facultyID').get(getFacultyByID)


module.exports = router;