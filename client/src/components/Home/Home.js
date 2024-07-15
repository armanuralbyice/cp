import React from 'react';
import './Home.css'
import Loader from '../layout/Loader'
const Home = ({ isSidebarClosed }) => {
    return (
        <div className={`home-section ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            <Loader size={100} color="#68C9EA" timeout={3000} />
            <div className='home'>
                <h1>Welcome to East West University</h1>
            </div>
        </div>
    );
};

export default Home;