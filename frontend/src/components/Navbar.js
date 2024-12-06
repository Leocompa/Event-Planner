import React, { useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';

const Navigation = () => {
    // Estrae i valori dal contesto di autenticazione
    const { username, logout } = useAuth();
    const navigate = useNavigate(); // Hook per navigare a una pagina specifica
    const [isLoggingOut, setIsLoggingOut] = useState(false); // Stato per gestire il processo di logout

    // Funzione per gestire il logout
    const handleLogout = async () => {
        setIsLoggingOut(true); // Imposta lo stato di caricamento durante il logout
        try {
            await logout();  // Chiamata alla funzione logout che potrebbe essere asincrona
            navigate('/login'); // Reindirizza l'utente alla pagina di login dopo il logout
        } catch (error) {
            console.error("Logout failed", error); // Logga eventuali errori durante il logout
            setIsLoggingOut(false); // Ferma lo stato di caricamento se si verifica un errore
        }
    };

    return (
        <Navbar bg="light" expand="lg">  {/* Navbar di Bootstrap con tema chiaro */}
            <Navbar.Brand href="/">Event Planner</Navbar.Brand> {/* Logo del sito che porta alla home */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" /> {/* Bottone per toggle del menu su dispositivi mobili */}
            <Navbar.Collapse id="basic-navbar-nav">  {/* Collassa il menu sui dispositivi mobili */}
                <Nav className="ml-auto"> {/* Navbar allineata a destra */}
                    {username ? (  // Verifica se l'utente è loggato controllando la presenza del username
                        <>
                            <Nav.Link as={Link} to="/calendar">Calendar</Nav.Link>  {/* Link al calendario */}
                            <Navbar.Text className="mr-2">Logged in as: {username}</Navbar.Text>  {/* Mostra il nome utente */}
                            <Nav.Link onClick={handleLogout} disabled={isLoggingOut}>
                                {/* Mostra il testo 'Logging out...' durante il logout o 'Logout' altrimenti */}
                                {isLoggingOut ? 'Logging out...' : 'Logout'}
                            </Nav.Link>
                        </>
                    ) : (  // Se l'utente non è loggato
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>  {/* Link alla pagina di login */}
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>  {/* Link alla pagina di registrazione */}
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
