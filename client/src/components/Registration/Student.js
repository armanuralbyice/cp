import React, { useState } from 'react';
import MetaData from "../layout/MetaData";
import axios from "axios";
import { toast } from "react-toastify";
const Student = ({ isSidebarClosed }) => {
    const [departments, setDepartments] = React.useState([]);
    const [semesters, setSemesters] = React.useState([]);
    const [student, setStudent] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        department: '',
        semester: '',
        address: {
            presentAddress: {
                district: '',
                thana: '',
                postCode: ''
            },
            permanentAddress: {
                district: '',
                thana: '',
                postCode: ''
            }
        }
    })
    const onChange = (e) => {
        const { name, value } = e.target;
        const updatedStudent = { ...student };

        if (name.startsWith("address.")) {
            const [addressType, field] = name.split('.').slice(1);
            updatedStudent.address[addressType][field] = value;
        } else {
            updatedStudent[name] = value;
        }

        setStudent(updatedStudent);
    };
    const handelSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:4000/user/student/save', student, {
            // headers: {
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //     'Content-Type': 'application/json',
            // },
        })
            .then((res) => {
                if (res.status === 201) {
                    toast.success(res.data.message)
                }
            })
            .catch((err) => {
                if (err.response) {
                    toast.warning(err.response.data.message);
                    console.log(err);
                } else {
                    toast.error('An error occurred');
                }
            })
    }

    const fetchDepartments = () => {
        axios
            .get('http://localhost:4000/department/all', {
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
    const fetchSemesters = () => {
        axios
            .get('http://localhost:4000/semester/all', {
                // headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
                //     'Content-Type': 'application/json',
                // },
            })
            .then((res) => {
                setSemesters(res.data.semester);

            })
            .catch((err) => {
                console.log(err)
            });

    }



    React.useEffect(() => {
        fetchDepartments();
        fetchSemesters()
    }, []);
    return (
        <div className={`home-section ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            <MetaData title={'Student Registration'} />
            <div className="home-content">
                <div className='title'>
                    <h2>Student Registration</h2>
                </div>
                <div className="container">
                    <form onSubmit={handelSubmit}>
                        <div className="form first">
                            <div className="details personal">
                                <span className="title">Personal Details</span>
                                <div className="fields">
                                    <div className="input-field">
                                        <label>Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your name"
                                            name="name"
                                            value={student.name}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Date of Birth</label>
                                        <input
                                            type="date"
                                            placeholder="Enter your birthday"
                                            name="dateOfBirth"
                                            value={student.dateOfBirth}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            name="email"
                                            value={student.email}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Mobile Number</label>
                                        <input
                                            type="text"
                                            placeholder="Enter mobile number"
                                            name="phone"
                                            value={student.phone}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Semester</label>
                                        <select
                                            name="semester"
                                            value={student.semester._id}
                                            onChange={onChange}
                                            autoComplete='off'
                                        >
                                            <option value="">Select</option>
                                            {semesters.map(semester => (
                                                <option key={semester._id} value={semester._id}>
                                                    {`${semester.season}-${semester.year}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="input-field">
                                        <label>Department</label>
                                        <select
                                            name="department"
                                            value={student.department}
                                            onChange={onChange}
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
                                    <div className="input-field">
                                        <label>Gender</label>
                                        <select
                                            name='gender'
                                            value={student.gender}
                                            onChange={onChange}
                                            required
                                        >
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Others">Others</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="details ID">
                                <span className="title">Present Address</span>
                                <div className="fields">
                                    <div className="input-field">
                                        <label>District</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your District"
                                            name="address.presentAddress.district"
                                            value={student.address.presentAddress.district}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />

                                    </div>
                                    <div className="input-field">
                                        <label>Thana</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your Thana"
                                            name="address.presentAddress.thana"
                                            value={student.address.presentAddress.thana}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Postal Code</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your Postal Code"
                                            name='address.presentAddress.postCode'
                                            value={student.address.presentAddress.postCode}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="details ID">
                                <span className="title">Permanent Address</span>
                                <div className="fields">
                                    <div className="input-field">
                                        <label>District</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your District"
                                            name='address.permanentAddress.district'
                                            value={student.address.permanentAddress.district}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Thana</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your Thana"
                                            name='address.permanentAddress.thana'
                                            value={student.address.permanentAddress.thana}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Postal Code</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your Postal Code"
                                            name='address.permanentAddress.postCode'
                                            value={student.address.permanentAddress.postCode}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='btn'>
                                <button className="button" >Submit</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Student;

