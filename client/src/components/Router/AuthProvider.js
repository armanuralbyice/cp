import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(localStorage.getItem('role') || 'admin');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const name = localStorage.getItem('name');
        const email = localStorage.getItem('email');

        if (token && role) {
            setUser({
                token,
                role,
                name,
                email
            });
            setIsAuthenticated(true);
            setUserRole(role);
        } else {
            setUser(null);
            setIsAuthenticated(false);
            setUserRole(null);
        }
    }, []);
    console.log(user);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userRole, user }}>
            {children}
        </AuthContext.Provider>
    );
};

