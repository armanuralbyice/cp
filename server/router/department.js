const express = require('express');

const { saveDepartment, allDepartment, deleteDepartment } = require("../controller/departmentController");
const { authenticateRegister, authorizeRegisterRoles } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateRegister)
router.use(authorizeRegisterRoles)

router.route('/save').post(saveDepartment)
router.route('/all').get(allDepartment)
router.route('/delete/:id').delete(deleteDepartment)

module.exports = router;