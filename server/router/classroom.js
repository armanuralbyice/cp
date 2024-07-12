const express = require('express');
//const { authenticateRegister, authorizeRegisterRoles } = require("../middleware/auth");
const { saveClassroom, getAllClassrooms, deleteClassroom } = require('../controller/classroomController');



const router = express.Router();
// router.use(authenticateRegister)
// router.use(authorizeRegisterRoles)

router.route('/save').post(saveClassroom)
router.route('/all').get(getAllClassrooms)
router.route('/delete/:id').delete(deleteClassroom)

module.exports = router;