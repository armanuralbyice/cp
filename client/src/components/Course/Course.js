import React, { useEffect, useState } from 'react';
import MetaData from "../layout/MetaData";
import Pagination from "@mui/material/Pagination";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from '../layout/Loader'

const Course = ({ isSidebarClosed }) => {
    const [course, setCourse] = useState({
        courseCode: '',
        department: '',
        credit: ''
    });
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const handleCourseSubmit = (e) => {
        e.preventDefault();
        axios
            .post('https://cp-wine-mu.vercel.app/course/save', course, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                if (res.status === 201) {
                    toast.success(res.data.message);
                    fetchCourses();
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    toast.warning(err.response.data.message);
                } else {
                    toast.error('An error occurred');
                }
            });
    };

    const [departments, setDepartments] = useState([]);
    const fetchDepartments = () => {
        axios
            .get('https://cp-wine-mu.vercel.app/department/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                setDepartments(res.data.department);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const [courses, setCourses] = useState([]);
    const fetchCourses = () => {
        let url = 'https://cp-wine-mu.vercel.app/course/all';

        if (selectedDepartment) {
            url = `https://cp-wine-mu.vercel.app/filter?department=${selectedDepartment}`;
        }

        axios
            .get(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                setCourses(res.data.courses);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchDepartments(selectedDepartment);
        fetchCourses();
    }, [selectedDepartment]);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(1);
    };

    const displayedCourses = courses ? courses.slice((page - 1) * rowsPerPage, page * rowsPerPage) : [];



    const onFilterDepartmentChange = (e) => {
        const { value } = e.target;
        const department = departments.find(dep => dep._id === value);
        setSelectedDepartment(department ? department._id : '');
    };




    return (
        <div className={`home-section ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            <MetaData title={'Create Course'} />
            <div className="home-content">
                <Loader size={100} color="#68C9EA" timeout={5000} />
                <div className='title'>
                    <h2>Create Course</h2>
                </div>
                <div className="createContainer">
                    <div className='create'>
                        <form onSubmit={handleCourseSubmit}>
                            <div className="fields">
                                <div className="input-field">
                                    <label>Course Code</label>
                                    <input style={{ 'width': '200px' }}
                                        type="text"
                                        placeholder="Enter the course Code"
                                        name="courseCode"
                                        value={course.courseCode}
                                        onChange={(e) => setCourse({ ...course, courseCode: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="input-field-semester">
                                    <label>Credit</label>
                                    <select style={{ 'width': '200px' }}
                                        name="credit"
                                        value={Course.credit}
                                        onChange={(e) => setCourse({ ...course, credit: e.target.value })}
                                        required
                                    >
                                        <option value="">Select</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>

                                    </select>
                                </div>
                                <div className="input-field-semester">
                                    <label>Department</label>
                                    <select
                                        style={{ 'width': '200px' }}
                                        name="department"
                                        value={Course.department}
                                        onChange={(e) => setCourse({ ...course, department: e.target.value })}
                                        required
                                    >
                                        <option value="">Select</option>
                                        {departments.map(department => (
                                            <option key={department._id} value={department._id}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='btn'>
                                <button className="button">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className='tableBox'>
                        <div style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'space-between' }}>
                            <div>
                                <h2>Courses</h2>
                            </div>
                            <div className="input-field-semester">
                                <label>Department</label>
                                <select
                                    style={{ 'width': '200px' }}
                                    value={selectedDepartment}
                                    onChange={onFilterDepartmentChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    {departments.map(department => (
                                        <option key={department._id} value={department._id}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className='table'>
                            <table className="fl-table">
                                <thead>
                                    <tr>
                                        <th>Course Code</th>
                                        <th>Credit</th>
                                        <th>Department</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedCourses && displayedCourses.length > 0 ? (
                                        displayedCourses.map((course, index) => (
                                            <tr key={index}>
                                                <td>{course.courseCode}</td>
                                                <td>{course.credit}</td>
                                                <td>{course.department ? course.department.name : 'Unknown Department'}</td>
                                                {/* Add other columns as needed */}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3"> No Course found!</td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                        <div className='pagination-box'>
                            <div>
                                <Pagination
                                    color="primary"
                                    count={courses ? Math.ceil(courses.length / rowsPerPage) : 0}
                                    page={page}
                                    onChange={handleChangePage}
                                    rowsPerPage={rowsPerPage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </div>
                            <div style={{ 'marginLeft': '20px' }}>
                                <FormControl>
                                    <InputLabel htmlFor="rowsPerPage">Rows Per Page</InputLabel>
                                    <Select className='formControl'
                                        value={rowsPerPage}
                                        label="Rows Per Page"
                                        onChange={handleChangeRowsPerPage}
                                        inputProps={{
                                            name: 'rowsPerPage',
                                            id: 'rowsPerPage',
                                        }}
                                    >
                                        <MenuItem value={rowsPerPage}>10</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={30}>30</MenuItem>
                                        <MenuItem value={40}>40</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Course;