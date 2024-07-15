import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'admin');

    useEffect(() => {
        if (isAuthenticated) {
            const role = localStorage.getItem('role') || 'admin';
            setUserRole(role);
        } else {
            setUserRole('admin');
        }
    }, [isAuthenticated]);
    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};
