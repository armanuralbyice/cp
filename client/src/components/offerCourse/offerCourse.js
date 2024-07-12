import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import MetaData from "../layout/MetaData";
import {
    fetchClassRooms,
    fetchCourses,
    fetchDepartmentData,
    fetchFaculties,
    fetchSemesterData
} from "../utils/fetchData";

const OfferCourses = ({ isSidebarClosed }) => {
    const [semesters, setSemesters] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('');
    const [isConflict, setIsConflict] = useState(false);
    const [offerCourses, setOfferCourses] = useState([
        {
            classRoom: "",
            labRoom: "",
            facultyName: "",
            courseName: "",
            seat: '',
            section: '',
            classTime: "",
            labTime: ""
        }
    ]);
    console.log(offerCourses);

    useEffect(() => {
        fetchInitialData();
    }, [selectedDepartment]);

    const fetchInitialData = async () => {
        try {
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

            const classroomResponse = await fetchClassRooms();
            if (classroomResponse && Array.isArray(classroomResponse.classrooms)) {
                setClassrooms(classroomResponse.classrooms);
            } else {
                console.error("Classroom data is not in the expected format", classroomResponse);
            }

            if (selectedDepartment) {
                const courseResponse = await fetchCourses(selectedDepartment);
                if (courseResponse && Array.isArray(courseResponse.courses)) {
                    setCourses(courseResponse.courses);
                } else {
                    console.error("Course data is not in the expected format", courseResponse);
                }

                const facultyResponse = await fetchFaculties(selectedDepartment);
                if (facultyResponse && Array.isArray(facultyResponse.faculties)) {
                    setFaculties(facultyResponse.faculties);
                } else {
                    console.error("Faculty data is not in the expected format", facultyResponse);
                }
            }
        } catch (err) {
            console.error('Error fetching initial data:', err);
        }
    };

    const handleOfferCourseChange = (index, field, value) => {
        const newOfferCourses = [...offerCourses];
        newOfferCourses[index][field] = value;
        setOfferCourses(newOfferCourses);
        const hasConflict = checkForConflicts(newOfferCourses);
        setIsConflict(hasConflict);
    };

    const checkForConflicts = (coursesToCheck) => {
        const roomSchedule = {};
        const facultySchedule = {};
        let conflictFound = false;

        coursesToCheck?.forEach((course, index) => {
            const { classTime, labTime, classRoom, labRoom, facultyName, courseName, section } = course;

            // Check for class conflicts
            if (classTime && classRoom) {
                const classKey = `${classTime}-${classRoom}`;
                if (roomSchedule[classKey]) {
                    conflictFound = true;
                    return;
                }
                roomSchedule[classKey] = true;
            }

            // Check for lab conflicts
            if (labTime && labRoom) {
                const labKey = `${labTime}-${labRoom}`;
                if (roomSchedule[labKey]) {
                    conflictFound = true;
                    return;
                }
                roomSchedule[labKey] = true;
            }

            // Check for faculty conflicts
            if (facultyName) {
                if (classTime) {
                    if (facultySchedule[facultyName] && facultySchedule[facultyName].includes(classTime)) {
                        conflictFound = true;
                        return;
                    }
                    facultySchedule[facultyName] = facultySchedule[facultyName] ? [...facultySchedule[facultyName], classTime] : [classTime];
                }

                if (labTime) {
                    if (facultySchedule[facultyName] && facultySchedule[facultyName].includes(labTime)) {
                        conflictFound = true;
                        return;
                    }
                    facultySchedule[facultyName] = facultySchedule[facultyName] ? [...facultySchedule[facultyName], labTime] : [labTime];
                }
            }

            const sameCourseConflict = coursesToCheck.findIndex((otherCourse, otherIndex) => {
                return otherIndex !== index && otherCourse.courseName === courseName && otherCourse.section === section;
            });

            if (sameCourseConflict !== -1) {
                conflictFound = true;
            }
        });

        return conflictFound;
    };

    const addCourse = () => {
        setOfferCourses([...offerCourses, {
            classRoom: "",
            labRoom: "",
            facultyName: "",
            courseName: "",
            seat: '',
            section: '',
            classTime: "",
            labTime: ""
        }]);
    };

    const removeCourse = (index) => {
        const newOfferCourses = [...offerCourses];
        newOfferCourses.splice(index, 1);
        setOfferCourses(newOfferCourses);
    };

    const handelDepartmentChange = (e) => {
        const department = e.target.value;
        setSelectedDepartment(department);
    };

    const handelSemesterChange = (e) => {
        const semester = e.target.value;
        setSelectedSemester(semester);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            semester: selectedSemester,
            department: selectedDepartment,
            courses: [...offerCourses]
        };

        try {
            console.log(dataToSend);
            const response = await axios.post('https://cp-wine-mu.vercel.app/offer-course/save', dataToSend);
            console.log('Courses offered successfully:', response.data);
            toast.success("Courses offered successfully!");

        } catch (err) {
            console.error('Error offering courses:', err);
            toast.error("Error offering courses!");
        }
    };

    return (
        <div className={`home-section ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            <MetaData title={'Offer Courses'} />
            <div className="home-content">
                <div className='title'>
                    <h2>Offer Courses</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='description'>
                        <div className="input-field" style={{ marginRight: '20px' }}>
                            <label>Semester</label>
                            <select
                                style={{ width: '250px' }}
                                name="semester"
                                value={selectedSemester}
                                onChange={handelSemesterChange}
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
                                value={selectedDepartment}
                                onChange={handelDepartmentChange}
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
                                    <thead style={{ 'position': 'relative' }}>
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
                                        {offerCourses.map((course, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <div className="input-field-offerCourses">
                                                        <select
                                                            value={course.courseName}
                                                            onChange={(e) => handleOfferCourseChange(index, 'courseName', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select</option>
                                                            {courses.map(c => (
                                                                <option key={c._id} value={c._id}>
                                                                    {c.courseCode}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="input-field-offerCourses">
                                                        <input
                                                            type="text"
                                                            placeholder="Seat"
                                                            value={course.seat}
                                                            onChange={(e) => handleOfferCourseChange(index, 'seat', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="input-field-offerCourses">
                                                        <select
                                                            value={course.section}
                                                            onChange={(e) => handleOfferCourseChange(index, 'section', e.target.value)}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="1">1</option>
                                                            <option value="2">2</option>
                                                            <option value="3">3</option>
                                                            <option value="4">4</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="input-field-offerCourses">
                                                        <select
                                                            value={course.classTime}
                                                            onChange={(e) => handleOfferCourseChange(index, 'classTime', e.target.value)}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="ST 8:30-9:30">ST 8:30-9:30</option>
                                                            <option value="MW 8:30-9:30">MW 8:30-9:30</option>
                                                            <option value="TR 8:30-9:30">TR 8:30-9:30</option>
                                                            <option value="ST 9:40-10:40">ST 9:40-10:40</option>
                                                            <option value="MW 9:40-10:40">MW 9:40-10:40</option>
                                                            <option value="TR 9:40-10:40">TR 9:40-10:40</option>
                                                            <option value="ST 10:50-11:50">ST 10:50-11:50</option>
                                                            <option value="MW 12:00-1:00">MW 12:00-1:00</option>
                                                            <option value="TR 12:00-1:00">TR 12:00-1:00</option>
                                                            <option value="ST 12:00-1:00">ST 12:00-1:00</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="input-field-offerCourses">
                                                        <select
                                                            value={course.labTime}
                                                            onChange={(e) => handleOfferCourseChange(index, 'labTime', e.target.value)}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="S 2:00-3:30">S 2:00-3:30</option>
                                                            <option value="S 4:00-5:30">S S 4:00-5:30</option>
                                                            <option value="M 2:00-3:30">M 2:00-3:30</option>
                                                            <option value="M 4:00-5:30">M 4:00-5:30</option>
                                                            <option value="T 2:00-3:30">T 2:00-3:30</option>
                                                            <option value="T 4:00-5:30">T 4:00-5:30</option>
                                                            <option value="R 2:00-3:30">R 2:00-3:30</option>
                                                            <option value="R 4:00-5:30">R 4:00-5:30</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="input-field-offerCourses">
                                                        <select
                                                            value={course.classRoom}
                                                            onChange={(e) => handleOfferCourseChange(index, 'classRoom', e.target.value)}
                                                        >
                                                            <option value="">Select</option>
                                                            {classrooms.map(room => (
                                                                <option key={room._id} value={room._id}>
                                                                    {room.building}-{room.classroomNo}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="input-field-offerCourses">
                                                        <select
                                                            value={course.labRoom}
                                                            onChange={(e) => handleOfferCourseChange(index, 'labRoom', e.target.value)}
                                                        >
                                                            <option value="">Select</option>
                                                            {classrooms.map(room => (
                                                                <option key={room._id} value={room._id}>
                                                                    {room.building}-{room.classroomNo}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="input-field-offerCourses">
                                                        <select
                                                            value={course.facultyName}
                                                            onChange={(e) => handleOfferCourseChange(index, 'facultyName', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">Select</option>
                                                            {faculties.map(faculty => (
                                                                <option key={faculty._id} value={faculty._id}>
                                                                    {faculty.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className='addAndRemoveButton'>
                                                        <FontAwesomeIcon icon={faCirclePlus} onClick={addCourse} disabled={isConflict} />
                                                        <FontAwesomeIcon icon={faTrash} onClick={() => removeCourse(index)} disabled={isConflict} />
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className='btn'>
                                <button type='submit' className="button" disabled={isConflict}>Submit</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OfferCourses;
