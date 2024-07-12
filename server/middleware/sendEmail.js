const nodemailer = require('nodemailer');
const { hash } = require('bcrypt');
const Student = require('../model/studentSchema');
const Faculty = require('../model/facultySchema');
const Admin = require('../model/adminSchema');
const Department = require('../model/departmentSchema');
const ErrorHandler = require('../utlis/ErrorHandler');

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'capstoneprojecta005@gmail.com',
                pass: 'royocidbwyhfdwow',
            },
        });

        const mailOptions = {
            from: '"Capstone Project Admin" <noreply@gmail.com>',
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new ErrorHandler('Failed to send email', 500);
    }
};

exports.addStudentAndSendEmail = async (req, res, next) => {
    const { email, department } = req.body;

    try {
        if (!email) {
            throw new ErrorHandler('Email address not provided', 400);
        }

        const existingDepartment = await Department.findById(department).populate('students');
        if (!existingDepartment) {
            throw new ErrorHandler('Department not found', 404);
        }

        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await hash(randomPassword, 10);

        const student = await Student.create({
            ...req.body,
            password: hashedPassword,
            department: existingDepartment._id,
        });

        existingDepartment.students.push(student);
        await existingDepartment.save();

        const emailHtml = `
            <p>Congratulations! ${student.name}</p>
            <p>Your Student ID: ${student.studentID}</p>
            <p>Your Password: ${randomPassword}</p>
            <br>
            <h5>Login</h5>
        `;

        await sendEmail(email, 'Login to Student Portal', emailHtml);

        res.status(201).json({
            success: true,
            student,
            message: 'Registration successful. Email sent to student.',
        });
    } catch (error) {
        console.error('Error adding student:', error);
        next(error);
    }
};

exports.addFacultyAndSendEmail = async (req, res, next) => {
    const { email, department } = req.body;

    try {
        if (!email) {
            throw new ErrorHandler('Email address not provided', 400);
        }

        const existingDepartment = await Department.findById(department).populate('faculties');
        if (!existingDepartment) {
            throw new ErrorHandler('Department not found', 404);
        }

        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await hash(randomPassword, 10);

        const faculty = await Faculty.create({
            ...req.body,
            password: hashedPassword,
            department: existingDepartment._id,
        });

        existingDepartment.faculties.push(faculty);
        await existingDepartment.save();

        const emailHtml = `
            <p>Congratulations! ${faculty.name}</p>
            <p>Your Faculty ID: ${faculty.facultyID}</p>
            <p>Your Password: ${randomPassword}</p>
            <br>
            <h3>Login</h3>
        `;

        await sendEmail(email, 'Login to Faculty Portal', emailHtml);

        res.status(201).json({
            success: true,
            faculty,
            message: 'Registration successful. Email sent to faculty.',
        });
    } catch (error) {
        console.error('Error adding faculty:', error);
        next(error);
    }
};

exports.addAdminAndSendEmail = async (req, res, next) => {
    const { email } = req.body;

    try {
        if (!email) {
            throw new ErrorHandler('Email address not provided', 400);
        }

        const randomPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await hash(randomPassword, 10);

        const admin = await Admin.create({
            ...req.body,
            password: hashedPassword,
        });

        const emailHtml = `
            <p>Congratulations! ${admin.name}</p>
            <p>Your Admin ID: ${admin.adminID}</p>
            <p>Your Password: ${randomPassword}</p>
            <br>
            <h3>Login</h3>
        `;

        await sendEmail(email, 'Login to Admin Portal', emailHtml);

        res.status(201).json({
            success: true,
            admin,
            message: 'Registration successful. Email sent to admin.',
        });
    } catch (error) {
        console.error('Error adding admin:', error);
        next(error);
    }
};
