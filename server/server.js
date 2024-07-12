const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const semesterRouter = require('./router/semester')
const departmentRouter = require('./router/department')
const classroomRouter = require('./router/classroom')
const courseRouter = require('./router/course')
const studentRouter = require('./router/student')
const facultyRouter = require('./router/faculty')
const ErrorHandler = require('./middleware/errors')
const app = express()

app.use(express.json())

// app.use(cors({
//     origin: 'https://cp-frontend-red.vercel.app',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Authorization', 'Content-Type']
// }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

const PORT = process.env.PORT || 4001
const DB = process.env.DB

mongoose.set('strictQuery', true);
mongoose
    .connect(DB)
    .then(() => console.log('Database connection successfully'))
    .catch((err) => console.log(err));
app.use('/semester', semesterRouter)
app.use('/department', departmentRouter)
app.use('/classroom', classroomRouter)
app.use('/course', courseRouter)
app.use('/user', studentRouter)
app.use('/user', facultyRouter)
app.use(ErrorHandler);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT} in ${process.env.NODE_ENV} mode`);
});