import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
    const [userName, setUserName] = useState(localStorage.getItem('name') || '');
    const [userEnail, setUserEmail] = useState(localStorage.getItem('email') || '');

    useEffect(() => {
        if (isAuthenticated) {
            const role = localStorage.getItem('role');
            const name = localStorage.getItem('name');
            const email = localStorage.getItem('email');
            setUserName(name)
            setUserEmail(email);
            setUserRole(role);
        } else {
            setUserRole('admin');
        }
    }, [isAuthenticated]);
    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, userName, userEnail }}>
            {children}
        </AuthContext.Provider>
    );
};
