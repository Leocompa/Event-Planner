import React, { createContext, useContext, useState, useEffect } from 'react';

// Creating the context
const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User state
    const [loading, setLoading] = useState(true); // Loading state to check the token
    const [error, setError] = useState(null); // Error state for handling errors

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        
        if (token && username) {
            setUser({ token, username });
        }

        setLoading(false); // After checking the token, set loading to false
    }, []);

    const login = (token) => {
        try {
            const username = "dummyUsername";  // Replace with actual username if needed
            localStorage.setItem('token', token);
            localStorage.setItem('username', username); // Also save the username
            setUser({ token, username }); // Save the user in the state
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('An error occurred during login');
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setUser(null); // Remove the user from the state
            setError(null); // Clear any previous errors
        } catch (err) {
            setError('An error occurred during logout');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {!loading ? children : <div>Loading...</div>} {/* Renders children only when loading is complete */}
        </AuthContext.Provider>
    );
};
