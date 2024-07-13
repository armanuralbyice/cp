import './App.css'
import { BrowserRouter as Router, Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import { useState } from "react";
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
          <Route path="/login" element={<Login />} />
          <Route element={(<PrivateRoute><Sidebar
            toggleSubMenu={toggleSubMenu}
            toggleSidebar={toggleSidebar}
            handleDropdownClick={handleDropdownClick}
            isSubMenuOpen={isSubMenuOpen}
            isSidebarClosed={isSidebarClosed}
          /><Outlet /></PrivateRoute>)}>
            <Route path="/home" element={<PrivateRoute><Home isSidebarClosed={isSidebarClosed} /></PrivateRoute>} />
            <Route path="/department" element={<Department isSidebarClosed={isSidebarClosed} />} />
            <Route path="/semester" element={<Semester isSidebarClosed={isSidebarClosed} />} />
            <Route path="/classroom" element={<Classroom isSidebarClosed={isSidebarClosed} />} />
            <Route path="/course" element={<Course isSidebarClosed={isSidebarClosed} />} />
            <Route path="/student" element={<Student isSidebarClosed={isSidebarClosed} />} />
            <Route path="/faculty" element={<Faculty isSidebarClosed={isSidebarClosed} />} />
            <Route path="/admin" element={<Admin isSidebarClosed={isSidebarClosed} />} />
            <Route path="/offer-course" element={<OfferCourses isSidebarClosed={isSidebarClosed} />} />
            <Route path="/offer-course/list" element={<OfferCoursesGrid isSidebarClosed={isSidebarClosed} />} />
            <Route path="/users" element={<User isSidebarClosed={isSidebarClosed} />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;