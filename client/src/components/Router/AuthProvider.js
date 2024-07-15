import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
    const [user, setUser] = useState({})

    useEffect(() => {
        if (isAuthenticated) {
            const role = localStorage.getItem('role');
            const name = localStorage.getItem('name');
            const email = localStorage.getItem('email');
            setUser({ name, email })
            setUserRole(role);
        } else {
            setUserRole('admin');
        }
    }, [isAuthenticated]);
    console.log(user);
    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole }}>
            {children}
        </AuthContext.Provider>
    );
};
