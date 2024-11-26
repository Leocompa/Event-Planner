import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
    const { username, logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();  // Aggiungi un'await se logout è una funzione asincrona
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
            setIsLoggingOut(false);
        }
    };

    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="/">Event Planner</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ml-auto">
                    {username ? (
                        <>
                            <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>
                            <Navbar.Text className="mr-2">Logged in as: {username}</Navbar.Text>
                            <Nav.Link onClick={handleLogout} disabled={isLoggingOut}>
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
