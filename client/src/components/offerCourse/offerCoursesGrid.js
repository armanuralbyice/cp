import React, { useEffect, useState } from 'react';
import MetaData from "../layout/MetaData";
import axios from "axios";
import { fetchDepartmentData, fetchOfferCourses, fetchSemesterData } from "../utils/fetchData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const OfferCoursesGrid = ({ isSidebarClosed }) => {
    const [semesters, setSemesters] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [offerCourses, setOfferCourses] = useState([]);
    const [semesterId, setSemesterId] = useState('');
    const [departmentId, setDepartmentId] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const semesterResponse = await fetchSemesterData();
            if (semesterResponse && Array.isArray(semesterResponse.semester)) {
                setSemesters(semesterResponse.semester);
            } else {
                console.error("Semester data is not in the expected format", semesterResponse);
            }

            const departmentResponse = await fetchDepartmentData();
            if (departmentResponse && Array.isArray(departmentResponse.department)) {
                setDepartments(departmentResponse.department);
            } else {
                console.error("Department data is not in the expected format", departmentResponse);
            }

            if (semesterId && departmentId) {
                const offerCoursesResponse = await fetchOfferCourses(semesterId, departmentId);
                if (offerCoursesResponse && Array.isArray(offerCoursesResponse.courses)) {
                    setOfferCourses(offerCoursesResponse.courses);
                    console.log(offerCoursesResponse.courses);
                } else {
                    console.error("OfferCourses data is not in the expected format", offerCoursesResponse);
                }
            }
        };
        loadData();
    }, [semesterId, departmentId]);

    const handleDepartmentChange = (e) => {
        const department = e.target.value;
        setDepartmentId(department);
    };

    const handleSemesterChange = (e) => {
        const semester = e.target.value;
        setSemesterId(semester);
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            const response = await axios.delete(`http://localhost:4000/offer-course/delete`, {
                // headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
                //     'Content-Type': 'application/json',
                // }
                params: {
                    semesterId,
                    departmentId,
                    courseId
                }
            });

            if (response.status === 200 && response.data.status === 'success') {
                setOfferCourses(prevCourses => prevCourses.filter(offerCourse => offerCourse._id !== courseId));
                toast.success('Deleted Successfully');
            } else {
                return
            }
        } catch (err) {
            console.error('Error:', err);
            toast.error('Internal Server Error.');
        }
    };

    return (
        <div className={`home-section ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            <MetaData title={'Offer Courses'} />

            <div className='title'>
                <h2>Show Offer Courses</h2>
            </div>
            <div className='description-showOfferCourses'>
                <div className="input-field" style={{ marginRight: '20px' }}>
                    <label>Semester</label>
                    <select
                        style={{ width: '250px' }}
                        name="semester"
                        value={semesterId}
                        onChange={handleSemesterChange}
                    >
                        <option value=''>Select</option>
                        {semesters.map(semester => (
                            <option key={semester._id} value={semester._id}>
                                {`${semester.season}-${semester.year}`}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="input-field" style={{ marginRight: '20px' }}>
                    <label>Department</label>
                    <select
                        style={{ width: '250px' }}
                        name="department"
                        value={departmentId}
                        onChange={handleDepartmentChange}
                        required
                    >
                        <option value=''>Select</option>
                        {departments.map(department => (
                            <option key={department._id} value={department._id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='offerCoursesContainer'>
                <div className='selectOfferCourses'>
                    <div className='course-list-box'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Course Code</th>
                                    <th>Seat</th>
                                    <th>Section</th>
                                    <th>Class Time</th>
                                    <th>Lab Time</th>
                                    <th>Class Room</th>
                                    <th>Lab Room</th>
                                    <th>Faculty Name</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offerCourses.length > 0 ? (
                                    offerCourses.map(offerCourse => (
                                        <tr key={offerCourse._id}>
                                            <td>{offerCourse.courseName.courseCode}</td>
                                            <td>{offerCourse.seat}</td>
                                            <td>{offerCourse.section}</td>
                                            <td>{offerCourse.classTime}</td>
                                            <td>{offerCourse.labTime}</td>
                                            <td>{`${offerCourse.classRoom.building}-${offerCourse.classRoom.classroomNo}`}</td>
                                            <td>{`${offerCourse.labRoom.building}-${offerCourse.labRoom.classroomNo}`}</td>
                                            <td>{offerCourse.facultyName.name}</td>
                                            <td style={{ 'fontSize': '20px', 'display': 'flex', 'justifyContent': 'space-around' }}>
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    onClick={() => handleDeleteCourse(offerCourse._id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No courses found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferCoursesGrid;
