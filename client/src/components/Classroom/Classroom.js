import React, { useEffect, useState } from 'react';
import MetaData from '../../components/layout/MetaData';
import axios from 'axios';
import { toast } from 'react-toastify';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Pagination from "@mui/material/Pagination";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import Loader from '../layout/Loader'
const Classroom = ({ isSidebarClosed }) => {
    const navigate = useNavigate()
    const [classroom, setClassroom] = useState({
        building: '',
        classroomNo: '',
    });
    const [classrooms, setClassrooms] = useState([]);
    const handleSemesterSubmit = (e) => {
        e.preventDefault();
        axios
            .post('https://cp-wine-mu.vercel.app/classroom/save', classroom, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                if (res.status === 201) {
                    setClassroom({
                        building: '',
                        classroomNo: '',
                    });
                    fetchClassrooms()
                    toast.success(res.data.message);
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    toast.warning(err.response.data.message);
                } else {
                    toast.warning('Internal Server Error');
                }
            });
    };
    // for pagination
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
    const displayedClassrooms = classrooms ? classrooms.slice(indexOfFirstItem, indexOfLastItem) : [];
    const fetchClassrooms = () => {
        axios
            .get('https://cp-wine-mu.vercel.app/classroom/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                setClassrooms(res.data.classrooms);
            })
            .catch((err) => {
                if (err.response) {
                    toast.error(err.response.data.message)
                } else {
                    toast.error('Internal Server Error');
                }
            });

    }
    useEffect(() => {
        fetchClassrooms();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://cp-wine-mu.vercel.app/classroom/delete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setClassrooms(classrooms.filter(classroom => classroom._id !== id));
            toast.success('Semester deleted successfully');
        } catch (error) {
            console.error('Error deleting semester:', error);
            toast.error('An error occurred while deleting semester');
        }
    };

    return (
        <div className={`home-section ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            <MetaData title={'Create Classroom'} />
            <div className="home-content">
                <Loader size={100} color="#68C9EA" timeout={5000} />
                <div className='title'>
                    <h2>Create ClassRoom</h2>
                </div>
                <div className="createContainer">
                    <div className='create-classroom'>
                        <form onSubmit={handleSemesterSubmit}>
                            <div className="fields">
                                <div className="input-field-createClassroom">
                                    <label>Building</label>
                                    <select
                                        name="building"
                                        value={classroom.building}
                                        onChange={(e) => setClassroom({ ...classroom, building: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option value="MB">Main Building</option>
                                        <option value="FUB">FUB</option>
                                        <option value="AB3">AB3</option>
                                    </select>
                                </div>
                                <div className="input-field-createClassroom">
                                    <label>Room No</label>
                                    <input
                                        type="text"
                                        placeholder="Enter classroom no"
                                        name="classroomNo"
                                        value={classroom.classroomNo}
                                        onChange={(e) => setClassroom({ ...classroom, classroomNo: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className='btn'>
                                <button className="button">Submit</button>
                            </div>
                        </form>
                    </div>
                    <div className='tableBox'>
                        <h2>Room Numbers</h2>
                        <div className='table'>
                            <table className="fl-table">
                                <thead>
                                    <tr>
                                        <th>Building</th>
                                        <th>Room No</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedClassrooms && displayedClassrooms.length > 0 ? (
                                        displayedClassrooms.map((classroom, index) => (
                                            <tr key={index}>
                                                <td>{classroom.building}</td>
                                                <td>{classroom.classroomNo}</td>
                                                <td onClick={() => handleDelete(classroom._id)}><FontAwesomeIcon icon={faTrash} /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4">No classrooms found!</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className='pagination-box'>
                            <div>
                                <Pagination
                                    color="primary"
                                    count={classrooms ? Math.ceil(classrooms.length / rowsPerPage) : 0}
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

export default Classroom;
