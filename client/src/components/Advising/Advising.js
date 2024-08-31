import React, { useEffect, useState } from 'react';
import { fetchAdvisingCourses, fetchOfferCoursesForAdvising } from "../utils/fetchData";
import MetaData from "../layout/MetaData";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { generatePDFAdvisingSlip } from "../utils/pdfGenerate";
import Loader from '../layout/Loader'

const Advising = ({ isSidebarClosed }) => {
    const [courseDetails, setCourseDetails] = useState([]);
    const [enrollCourses, setEnrollCourses] = useState([]);
    const [semester, setSemester] = useState('');
    const [student, setStudent] = useState({ name: '', studentID: '' });

    const fetchCourseList = async () => {
        try {
            const response = await fetchOfferCoursesForAdvising();
            if (response.offerCourseDetails && Array.isArray(response.offerCourseDetails.courses)) {
                setCourseDetails(response.offerCourseDetails.courses);
                setSemester(`${response.offerCourseDetails.semester.season}-${response.offerCourseDetails.semester.year}`);
                console.log("Offer Courses:", response.offerCourseDetails);
            } else {
                console.error("Course data is not in the expected format", response.offerCourseDetails);
            }

            const courseResponse = await fetchAdvisingCourses();
            if (courseResponse && Array.isArray(courseResponse.courses.enrollCourses)) {
                setEnrollCourses(courseResponse.courses.enrollCourses);
                if (courseResponse.courses.length > 0) {
                    const { student } = courseResponse.courses[0];
                    setStudent({ name: student.name, studentID: student.studentID });
                }
                console.log("Enrolled Courses:", courseResponse.courses);
            } else {
                console.error("Advising course data is not in the expected format", courseResponse.courses.enrollCourses);
            }
        } catch (error) {
            console.error('Error fetching course list:', error);
        }
    };

    useEffect(() => {
        fetchCourseList();
    }, []);

    const handleAddCourse = async (e, courseId) => {
        e.preventDefault();
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.post(`https://cp-wine-mu.vercel.app/advising/?courseId=${courseId}`, {}, config);
            if (response.status === 200) {
                toast.success('Course added successfully!');
                fetchCourseList();
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    toast.warning(err.response.data.message);
                } else {
                    toast.error('An error occurred');
                }
            } else {
                toast.error('An error occurred');
            }
        }
    };

    const handleDelete = async (courseId) => {
        const config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
        };
        try {
            const response = await axios.delete(`https://cp-wine-mu.vercel.app/advising/course/delete/${courseId}`, config);
            if (response.status === 200) {
                toast.success(response.data.message);
                await fetchCourseList();
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('An error occurred while deleting the course');
        }
    };

    return (
        <div className={`home-section ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            <MetaData title={'Advising'} />
            <Loader size={100} color="#68C9EA" timeout={3000} />
            <div className='title'>
                {semester && <h3>Advising: {semester}</h3>}
            </div>
            <div className='CourseInformation'>
                <div className='advisingContainer'>
                    <div className='course-list'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Section</th>
                                    <th>Class Time</th>
                                    <th>Class Room</th>
                                    <th>Lab Time</th>
                                    <th>Lab Room</th>
                                    <th>Available Seat</th>
                                </tr>
                            </thead>
                            <tbody>
    {courseDetails.map(course => (
        <tr key={course._id} onClick={(e) => handleAddCourse(e, course._id)} style={{ cursor: 'pointer' }}>
            <td>{course?.courseName?.courseCode || 'N/A'}</td>
            <td>{course?.section || 'N/A'}</td>
            <td>{course?.classTime || 'N/A'}</td>
            <td>{course?.classRoom ? `${course.classRoom.building}-${course.classRoom.classroomNo}` : 'N/A'}</td>
            <td>{course?.labTime || 'N/A'}</td>
            <td>{course?.labRoom ? `${course.labRoom.building}-${course.labRoom.classroomNo}` : 'N/A'}</td>
            <td>{course?.seat || 'N/A'}</td>
        </tr>
    ))}
</tbody>
                        </table>
                    </div>
                </div>
                <div className='printSlip' id="pdf-content">
                    <div className='student-List'>
                        <div className='course-title'>
                            <h4>Advising Slip</h4>
                            <FontAwesomeIcon icon={faPenToSquare} onClick={generatePDFAdvisingSlip} />
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Section</th>
                                    <th>Class Time</th>
                                    <th>Class Room</th>
                                    <th>Lab Time</th>
                                    <th>Lab Room</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
    {enrollCourses.map(enrollCourse => (
        <tr key={enrollCourse._id}>
            <td>{enrollCourse?.course?.courseName?.courseCode || 'N/A'}</td>
            <td>{enrollCourse?.course?.section || 'N/A'}</td>
            <td>{enrollCourse?.course?.classTime || 'N/A'}</td>
            <td>{enrollCourse?.course?.classRoom ? `${enrollCourse.course.classRoom.building}-${enrollCourse.course.classRoom.classroomNo}` : 'N/A'}</td>
            <td>{enrollCourse?.course?.labTime || 'N/A'}</td>
            <td>{enrollCourse?.course?.labRoom ? `${enrollCourse.course.labRoom.building}-${enrollCourse.course.labRoom.classroomNo}` : 'N/A'}</td>
            <td style={{ fontSize: '20px', justifyContent: 'space-around' }}>
                <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(enrollCourse?.course?._id)} />
            </td>
        </tr>
    ))}
</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Advising;
