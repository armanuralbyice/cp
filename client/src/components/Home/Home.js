import React from 'react';
import './Home.css'
const Home = ({ isSidebarClosed }) => {
    return (
        <div className={`home-section ${isSidebarClosed ? 'sidebar-close' : ''}`}>
            <div className='home'>
                <h1>Welcome to East West University</h1>
            </div>
        </div>
    );
};

export default Home;