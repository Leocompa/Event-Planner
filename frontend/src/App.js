import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import EventCalendar from './components/EventCalendar';
import Login from './components/Login';
import Register from './components/Register';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useAuth } from './context/AuthContext';

function App() {
    const { user, login, logout, loading } = useAuth();  // Estrae le funzioni e lo stato relativi all'autenticazione
    const [isModalVisible, setIsModalVisible] = useState(false);  // Stato per la visibilità del modal
    const [loginMessage, setLoginMessage] = useState('');  // Messaggio di successo per il login
    const [errorMessage, setErrorMessage] = useState('');  // Messaggio di errore per login e registrazione
    const navigate = useNavigate();  // Funzione per navigare tra le pagine

    // Effetto che si attiva quando l'utente è autenticato
    useEffect(() => {
        if (user) {
            setIsModalVisible(true);  // Mostra il modal per il login avvenuto con successo
            setLoginMessage('Login successful!');  // Imposta il messaggio di successo
            setTimeout(() => {
                navigate('/');  // Dopo 2 secondi, redirige alla pagina principale
            }, 2000);
        }
    }, [user, navigate]);  // Eseguito ogni volta che cambia lo stato `user`

    // Funzione per gestire il login dell'utente
    const handleLogin = (token) => {
        login(token);  // Chiama il metodo login fornito dal contesto per autenticare l'utente
    };

    // Funzione per gestire il logout dell'utente
    const handleLogout = () => {
        logout();  // Chiama il metodo logout per disconnettere l'utente
        navigate('/login');  // Redirige alla pagina di login
    };

    // Funzione per gestire la registrazione dell'utente
    const handleRegister = async (userData) => {
        try {
            const response = await fetch('http://localhost:5001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),  // Invio dei dati dell'utente per la registrazione
            });

            if (!response.ok) {
                const errorData = await response.json();  // Se la risposta non è ok, estrae il messaggio di errore
                setErrorMessage(errorData.message || 'Error during registration');
                setIsModalVisible(true);  // Mostra il modal con il messaggio di errore
                return;
            }

            const data = await response.json();  // Riceve i dati della risposta
            handleLogin(data.token);  // Esegui il login automaticamente con il token ricevuto
        } catch (error) {
            console.error('Error during registration:', error);  // Log degli errori
            setErrorMessage('An error occurred during registration.');
            setIsModalVisible(true);  // Mostra il modal con il messaggio di errore
        }
    };

    // Funzione per chiudere il modal
    const closeModal = () => {
        setIsModalVisible(false);  // Imposta lo stato del modal a invisibile
    };

    return (
        <div className="container">
            <header className="app-header">
                <h1 className="my-4">Event Planner</h1>
                {/* Se l'utente è loggato, mostra il pulsante per fare il logout */}
                {user && (
                    <button className="btn btn-logout" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </header>

            <main className="app-main">
                {/* Se la pagina è in fase di caricamento, mostra "Loading..." */}
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <Routes>
                        {/* Route per la pagina principale (calendar) */}
                        <Route
                            path="/"
                            element={user ? <EventCalendar /> : <Navigate to="/login" />}
                        />
                        {/* Route per la pagina di login */}
                        <Route
                            path="/login"
                            element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
                        />
                        {/* Route per la pagina di registrazione */}
                        <Route
                            path="/register"
                            element={user ? <Navigate to="/" /> : <Register onRegister={handleRegister} />}
                        />
                    </Routes>
                )}
            </main>

            {/* Modal di successo o errore dopo il login o la registrazione */}
            <Modal show={isModalVisible} onHide={closeModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{errorMessage ? 'Error' : 'Message'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{loginMessage || errorMessage}</Modal.Body> {/* Mostra il messaggio di successo o errore */}
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
