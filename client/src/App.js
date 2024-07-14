import './App.css'
import { BrowserRouter as Router, Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import BounceLoader from "react-spinners/BounceLoader";
import { useEffect, useState } from "react";
import Home from "./components/Home/Home";
import Department from './components/Department/Department';
import Semester from './components/Semester/Semester';
import Classroom from './components/Classroom/Classroom';
import Course from './components/Course/Course';
import Student from './components/Registration/Student';
import Faculty from './components/Registration/faculty';
import Admin from './components/Registration/admin';
import OfferCourses from './components/offerCourse/offerCourse';
import OfferCoursesGrid from './components/offerCourse/offerCoursesGrid';
import User from './components/User/User';
import Login from './components/Auth/Login';
import PrivateRoute from './components/Router/PrivateRouter';


function App() {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [isSidebarClosed, setIsSidebarClosed] = useState(true);

  const toggleSubMenu = () => {
    setIsSubMenuOpen(prevState => !prevState);
  };

  const toggleSidebar = () => {
    setIsSidebarClosed(prevState => !prevState);
  };

  const handleDropdownClick = (e) => {
    e.preventDefault();
    toggleSubMenu();
  };
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={(<PrivateRoute><Sidebar
            toggleSubMenu={toggleSubMenu}
            toggleSidebar={toggleSidebar}
            handleDropdownClick={handleDropdownClick}
            isSubMenuOpen={isSubMenuOpen}
            isSidebarClosed={isSidebarClosed}
          /><Outlet /></PrivateRoute>)}>
            <Route path="/home" element={<PrivateRoute><Home isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/department" element={<PrivateRoute><Department isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/semester" element={<PrivateRoute><Semester isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/classroom" element={<PrivateRoute><Classroom isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/course" element={<PrivateRoute><Course isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/student" element={<PrivateRoute><Student isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/faculty" element={<PrivateRoute><Faculty isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/admin" element={<PrivateRoute><Admin isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/offer-course" element={<PrivateRoute><OfferCourses isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/offer-course/list" element={<PrivateRoute><OfferCoursesGrid isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><User isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;