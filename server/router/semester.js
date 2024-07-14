const express = require('express');
const { saveSemester, allSemesters, deleteSemester } = require("../controller/semesterController");
const { authenticateRegister, authorizeRegisterRoles } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateRegister);
router.use(authorizeRegisterRoles);
router.route('/save').post(saveSemester)
router.route('/all').get(allSemesters)
router.route('/delete/:id').delete(deleteSemester)

module.exports = router;