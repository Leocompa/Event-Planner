import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import EventCalendar from './components/EventCalendar';
import Login from './components/Login';
import Register from './components/Register';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useAuth } from './context/AuthContext'; // useAuth from context

function App() {
    const { user, login, logout, loading } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loginMessage, setLoginMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            // Redirect to the main page after login
            setIsModalVisible(true);
            setLoginMessage('Login successful!');
            setTimeout(() => {
                navigate('/');
            }, 2000);
        }
    }, [user, navigate]);

    const handleLogin = (token) => {
        login(token);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleRegister = async (userData) => {
        try {
            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Error during registration');
                setIsModalVisible(true);
                return;
            }

            const data = await response.json();
            handleLogin(data.token);
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage('An error occurred during registration.');
            setIsModalVisible(true);
        }
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <div className="container">
            <header className="app-header">
                <h1 className="my-4">Event Planner</h1>
                {user && (
                    <button className="btn btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </header>

            <main className="app-main">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <Routes>
                        <Route
                            path="/"
                            element={user ? <EventCalendar /> : <Navigate to="/login" />}
                        />
                        <Route
                            path="/login"
                            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
                        />
                        <Route
                            path="/register"
                            element={user ? <Navigate to="/" /> : <Register onRegister={handleRegister} />}
                        />
                    </Routes>
                )}
            </main>

            {/* Success or Error modal after login or registration */}
            <Modal show={isModalVisible} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{errorMessage ? 'Error' : 'Message'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{loginMessage || errorMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default App;
