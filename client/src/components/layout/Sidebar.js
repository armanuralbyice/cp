import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faAngleDown,
    faBars,
    faBook,
    faHouse,
    faList,
    faPersonCirclePlus,
    faPlus,
    faShapes,
    faUsersGear
} from '@fortawesome/free-solid-svg-icons';
import './sidebar.css';
import {Link} from 'react-router-dom';
import MetaData from './MetaData';
import {useAuth} from '../Router/AuthProvider';

const Header = ({ isSidebarClosed, toggleSidebar }) => {
    const {isAuthenticated, userRole} = useAuth();
    const [isSubMenuOpen, setIsSubMenuOpen] = useState({
        create: false,
        registration: false
    });
    if (!isAuthenticated) {
        return null;
    }
    const toggleSubMenu = (menu) => {
        setIsSubMenuOpen(prevState => ({
            ...prevState,
            [menu]: !prevState[menu]
        }));
    };

    return (
        <div className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
            <MetaData title={'Home'} />
            <div className="dropdown-icon">
                <i style={{ 'cursor': 'pointer' }}>
                    <FontAwesomeIcon icon={faBars} className='bx bx-menu' onClick={toggleSidebar} />
                </i>
            </div>
            {
                isAuthenticated && (
            <ul className="nav-links">
                <li>
                    <Link to='/'>
                        <i><FontAwesomeIcon icon={faHouse} /></i>
                        <span className="link_name">Home</span>
                    </Link>
                    <ul className="sub-menu blank">
                        <li>
                            <Link to='/dashboard' className="link_name">
                                Home
                            </Link>
                        </li>
                    </ul>
                </li>
                {userRole === 'admin' && (
                    <>
                    <li>
                    <div className="icon-link">
                        <Link to='' onClick={() => toggleSubMenu('create')}>
                            <i><FontAwesomeIcon icon={faPlus} /></i>
                            <span className="link_name">Create</span>
                        </Link>
                        {!isSidebarClosed && (
                            <i>
                                <FontAwesomeIcon
                                    icon={faAngleDown}
                                    className={`arrow ${isSubMenuOpen['create'] ? 'up' : ''}`}
                                    onClick={() => toggleSubMenu('create')}
                                />
                            </i>
                        )}
                    </div>
                    <ul className={`sub-menu ${isSubMenuOpen['create'] ? 'showMenu' : ''}`}>
                        <li><h2 className="link_name">Create</h2></li>
                        <li><Link to="semester">Semester</Link></li>
                        <li><Link to="department">Department</Link></li>
                        <li><Link to="classroom">ClassRoom</Link></li>
                        <li><Link to="course">Course</Link></li>
                        <li><Link to="offer-course">Offer Course</Link></li>
                    </ul>
                </li>
                    </>
                )}

                {
                            userRole === 'admin' && (
                        <>
                        <li>
                    <div className="icon-link">
                        <Link to='' onClick={() => toggleSubMenu('registration')}>
                            <i><FontAwesomeIcon icon={faPersonCirclePlus} /></i>
                            <span className="link_name">Registration</span>
                        </Link>
                        {!isSidebarClosed && (
                            <i>
                                <FontAwesomeIcon
                                    icon={faAngleDown}
                                    className={`arrow ${isSubMenuOpen['registration'] ? 'up' : ''}`}
                                    onClick={() => toggleSubMenu('registration')}
                                />
                            </i>
                        )}
                    </div>
                    <ul className={`sub-menu ${isSubMenuOpen['registration'] ? 'showMenu' : ''}`}>
                        <li><h2 className="link_name">Registration</h2></li>
                        <li><Link to="student">Student</Link></li>
                        <li><Link to="faculty">Faculty</Link></li>
                        <li><Link to="admin">Admin</Link></li>
                    </ul>
                </li>
                        </>
                            )
                }
                {
                            userRole === 'admin' && (
                        <>
                        <li>
                    <Link to='/showOfferCourses'>
                        <i><FontAwesomeIcon icon={faShapes} /></i>
                        <span className="link_name">Offer Courses</span>
                    </Link>
                    <ul className="sub-menu blank">
                        <li>
                            <Link to='offer-course/list' className="link_name">
                                Offer Courses
                            </Link>
                        </li>
                    </ul>
                </li>
                        </>
                            )
                }
                {
                            userRole === 'student' && (
                        <>
                        <li>
                    <Link to='/advising'>
                        <i><FontAwesomeIcon icon={faBook} /></i>
                        <span className="link_name">Advising</span>
                    </Link>
                    <ul className="sub-menu blank">
                        <li>
                            <Link to='/users' className="link_name">
                                Advising
                            </Link>
                        </li>
                    </ul>
                </li>
                        </>
                            )
                }

                {
                            userRole === 'faculty' && (
                        <>
                        <li>
                    <Link to='/faculty/show-enroll-course'>
                        <i><FontAwesomeIcon icon={faList} /></i>
                        <span className="link_name">Faculty Course List</span>
                    </Link>
                    <ul className="sub-menu blank">
                        <li>
                            <Link to='/faculty/show-enroll-course' className="link_name">
                                Faculty Course List
                            </Link>
                        </li>
                    </ul>
                </li>
                        </>
                            )
                }

                {
                            userRole === 'admin' && (
                        <>
                        <li>
                    <Link to='users'>
                        <i><FontAwesomeIcon icon={faUsersGear} /></i>
                        <span className="link_name">Users</span>
                    </Link>
                    <ul className="sub-menu blank">
                        <li>
                            <Link to='users' className="link_name">
                                Users
                            </Link>
                        </li>
                    </ul>
                </li>
                        </>
                            )
                }

            </ul>
                )
            }
        </div>
    );
};

export default Header;
