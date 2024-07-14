const express = require('express');
const { saveAdmin, getAllAdmin, getAdminById } = require("../controller/adminController");
const { authenticateRegister, authorizeRegisterRoles } = require("../middleware/auth");



const router = express.Router();

router.use(authenticateRegister)
router.use(authorizeRegisterRoles)
router.route('/admin/save').post(saveAdmin)
router.route('/admins/all').get(getAllAdmin)
router.route('/admin/:adminID').get(getAdminById)

module.exports = router;