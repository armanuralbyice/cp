import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import Pagination from '@mui/material/Pagination';
import {
    TableBody,
    TableCell,
    TableRow,
} from '@mui/material';
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import MetaData from "../layout/MetaData";
const User = ({ isSidebarClosed }) => {
    const [studentId, setStudentId] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [adminID, setAdminId] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('students');
    const [allData, setAllData] = useState({ student: [], faculty: [], admin: [] });
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const fetchUsers = (department) => {
        let url = `https://cp-wine-mu.vercel.app/user/${selectedCategory}/all`;
        if (selectedDepartment) {
            url = `https://cp-wine-mu.vercel.app/user/${selectedDepartment}/${selectedCategory}`;
        }

        axios.get(url, {
            // headers: {
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //     'Content-Type': 'application/json',
            // },
        })
            .then((res) => {
                if (selectedCategory === 'students') {
                    setAllData({ ...allData, student: res.data.students });
                    setUsers(res.data.students);
                    console.log(res.data)
                } else if (selectedCategory === 'faculties') {
                    setAllData({ ...allData, faculty: res.data.faculties });
                    setUsers(res.data.faculties);
                } else if (selectedCategory === 'admins') {
                    setAllData({ ...allData, admin: res.data.admins });
                    setUsers(res.data.admins);
                }
            })
            .catch((err) => {
                console.error(`Error fetching users: ${err}`);
            });
    };
    useEffect(() => {
        fetchUsers(selectedDepartment);
        fetchDepartments()
    }, [selectedCategory, selectedDepartment]);


    const handleSearch = (e) => {
        if (
            (selectedCategory === 'students' && studentId) ||
            (selectedCategory === 'faculties' && facultyId) ||
            (selectedCategory === 'admins' && adminID)
        ) {
            if (selectedCategory === 'students') {
                axios
                    .get(`https://cp-wine-mu.vercel.app/user/student/${studentId}`, {
                        // headers: {
                        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        //     'Content-Type': 'application/json',
                        // },
                    })
                    .then((res) => {
                        if (res.data.student) {
                            setUsers([res.data.student]);
                        } else {
                            setUsers([]);
                        }
                    })
                    .catch((err) => {
                        if (err.response && err.response.status === 404) {
                            toast.warning(err.response.data.message);
                        } else {
                            toast.error('An error occurred');
                        }
                    });
            } else if (selectedCategory === 'faculties') {
                axios
                    .get(`https://cp-wine-mu.vercel.app/user/faculty/${facultyId}`, {
                        // headers: {
                        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        //     'Content-Type': 'application/json',
                        // },
                    })
                    .then((res) => {
                        if (res.data.faculty) {
                            setUsers([res.data.faculty]);
                        } else {
                            setUsers([]);
                        }
                    })
                    .catch((err) => {
                        if (err.response && err.response.status === 404) {
                            toast.warning(err.response.data.message);
                        } else {
                            toast.error('An error occurred');
                        }
                    });
            } else if (selectedCategory === 'admins') {
                axios
                    .get(`https://cp-wine-mu.vercel.app/user/admin/${adminID}`, {
                        // headers: {
                        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        //     'Content-Type': 'application/json',
                        // },
                    })
                    .then((res) => {
                        if (res.data.admin) {
                            setUsers([res.data.admin]);
                        } else {
                            setUsers([]);
                        }
                    })
                    .catch((err) => {
                        if (err.response && err.response.status === 404) {
                            toast.warning(err.response.data.message);
                        } else {
                            toast.error('An error occurred');
                        }
                    });
            }
        }
    };
    const handleSearchInputChange = (e) => {
        if (selectedCategory === 'students') {
            setStudentId(e.target.value);
        }
        if (selectedCategory === 'faculties') {
            setFacultyId(e.target.value);
        }
        if (selectedCategory === 'admins') {
            setAdminId(e.target.value);
        }
    };

    const handleClearSearch = () => {
        if (selectedCategory === 'students' && studentId) {
            setStudentId((prevStudentId) => prevStudentId.slice(0, -1) || '');
            setUsers(allData.student);
        } else if (selectedCategory === 'faculties' && facultyId) {
            setFacultyId((prevFacultyId) => prevFacultyId.slice(0, -1) || '');
            setUsers(allData.faculty);
        } else if (selectedCategory === 'admins' && adminID) {
            setAdminId((prevAdminId) => prevAdminId.slice(0, -1) || '');
            setUsers(allData.admin);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };
    const handelBackspace = (e) => {
        if (e.key === 'Backspace' && (studentId || facultyId || adminID)) {
            e.preventDefault();
            handleClearSearch();
        }
    }
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(1);
    };
    const indexOfLastItem = page * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const displayedUsers = users ? users.slice(indexOfFirstItem, indexOfLastItem) : [];
    const onFilterDepartmentChange = (e) => {
        const { value } = e.target;
        setSelectedDepartment(value);
    };
    const [departments, setDepartments] = React.useState([]);
    const fetchDepartments = () => {
        axios
            .get('https://cp-wine-mu.vercel.app/department/all', {
                // headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
                //     'Content-Type': 'application/json',
                // },
            })
            .then((res) => {
                setDepartments(res.data.department);
            })
            .catch((err) => {
                console.log(err)
            });

    }
    return (
        <div className={`home-section ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            <MetaData title={'Users'} />
            <div className="home-content">
                <div className='table_root'>
                    <div className='header-userData'>
                        <div className='btn-box'>
                            <div>
                                <button className='button' onClick={() => setSelectedCategory('students')}>Students
                                </button>
                            </div>
                            <div>
                                <button className='button'
                                    onClick={() => setSelectedCategory('faculties')}>Faculties
                                </button>
                            </div>
                            <div>
                                <button className='button' onClick={() => setSelectedCategory('admins')}>Admin
                                </button>
                            </div>
                            <div className="input-field">
                                <select
                                    name="department"
                                    value={selectedDepartment}
                                    onChange={onFilterDepartmentChange}
                                    required
                                >
                                    <option value="">Select</option>
                                    {departments.map(department => (
                                        <option key={department._id} value={department.name}>
                                            {department.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="search-box">
                            <button className="btn-search" onClick={handleSearch}>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                            <input
                                type="text"
                                className="input-search"
                                placeholder="Type to Search..."
                                value={
                                    selectedCategory === 'students' ? studentId : selectedCategory === 'faculties' ? facultyId :
                                        selectedCategory === 'admins' ? adminID : ''}

                                onChange={handleSearchInputChange}
                                onKeyPress={handleKeyPress}
                                onKeyDown={handelBackspace}
                            />
                        </div>
                    </div>
                    <div className="table-wrapper">
                        <table className="fl-table">
                            <thead>
                                <tr>
                                    {selectedCategory === 'students' && <th>Student ID</th>}
                                    {selectedCategory === 'faculties' && <th>Faculty ID</th>}
                                    {selectedCategory === 'admins' && <th>Admin ID</th>}
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Department</th>
                                    <th>Gender</th>
                                    <th>Date of Birth</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <TableBody>
                                {displayedUsers && displayedUsers.length > 0 ? (
                                    displayedUsers.map((user, index) => (
                                        <TableRow key={index}>
                                            {selectedCategory === 'students' && <TableCell>{user.studentID}</TableCell>}
                                            {selectedCategory === 'faculties' &&
                                                <TableCell>{user.facultyID}</TableCell>}
                                            {selectedCategory === 'admins' && <TableCell>{user.adminID}</TableCell>}
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.phone}</TableCell>
                                            <TableCell>{user.department.name}</TableCell>
                                            <TableCell>{user.gender}</TableCell>
                                            <TableCell>{new Date(user.dateOfBirth).toDateString()}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="8">No {selectedCategory} found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </table>
                    </div>
                    <div className='paginationAndRow'>
                        <div className='pagination'>
                            <Pagination
                                color="primary"
                                count={users ? Math.ceil(users.length / rowsPerPage) : 0}
                                page={page}
                                onChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onChangeRowsPerPage={handleChangeRowsPerPage}
                            />
                        </div>
                        <div className='row'>
                            <FormControl style={{ 'width': '110px' }}>
                                <InputLabel htmlFor="rowsPerPage">Rows Per Page</InputLabel>
                                <Select
                                    style={{ 'height': '25px', 'textAlign': 'center' }}
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
    );
};

export default User;