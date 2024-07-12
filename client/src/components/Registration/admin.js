import React, { useState } from 'react';
import MetaData from "../layout/MetaData";
import axios from "axios";
import { toast } from "react-toastify";
const Admin = ({ isSidebarClosed }) => {
    const [admin, setAdmin] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        department: '',
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
    const [departments, setDepartments] = React.useState([]);
    const onChange = (e) => {
        const { name, value } = e.target;
        console.log(e.target.value)
        const updatedAdmin = { ...admin };

        if (name.startsWith("address.")) {
            const [addressType, field] = name.split('.').slice(1);
            updatedAdmin.address[addressType][field] = value;
        } else {
            updatedAdmin[name] = value;
        }

        setAdmin(updatedAdmin);
    };
    const handelSubmit = (e) => {
        e.preventDefault()
        axios.post('https://cp-wine-mu.vercel.app/user/admin/save', admin, {
            // headers: {
            //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //     'Content-Type': 'application/json',
            // },
        })
            .then((res) => {
                if (res.status === 201) {
                    toast.success(res.data.message)
                    console.log(res.data)
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    toast.warning(err.response.data.message);
                    console.log(err)
                } else {
                    toast.error('An error occurred');
                    console.log(err);
                }
            })
    }
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
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err)
            });

    }
    React.useEffect(() => {
        fetchDepartments();
    }, []);
    return (
        <div className={`home-section ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            <MetaData title={'Admin Registration'} />
            <div className="home-content">
                <div className='title'>
                    <h2>Admin Registration</h2>
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
                                            value={admin.name}
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
                                            value={admin.dateOfBirth}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Email</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your email"
                                            name="email"
                                            value={admin.email}
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
                                            value={admin.phone}
                                            onChange={onChange}
                                            required
                                            autoComplete='off'
                                        />
                                    </div>
                                    <div className="input-field">
                                        <label>Department</label>
                                        <select
                                            name="department"
                                            value={admin.department}
                                            onChange={onChange}
                                            required
                                        >
                                            <option>Select</option>
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
                                            value={admin.gender}
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
                                            value={admin.address.presentAddress.district}
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
                                            value={admin.address.presentAddress.thana}
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
                                            value={admin.address.presentAddress.postCode}
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
                                            value={admin.address.permanentAddress.district}
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
                                            value={admin.address.permanentAddress.thana}
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
                                            value={admin.address.permanentAddress.postCode}
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

export default Admin;

