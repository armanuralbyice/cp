const express = require('express');
const { offerCourse, deleteOfferCourse, getOfferCourses } = require("../controller/offerCourseController");

//const { authenticateRegister, authorizeRegisterRoles } = require("../middleware/auth");


const router = express.Router();
// router.use(authenticateRegister);
// router.use(authorizeRegisterRoles);

router.route('/save').post(offerCourse)
router.route('/all').get(getOfferCourses)
router.route('/delete').delete(deleteOfferCourse)


module.exports = router;