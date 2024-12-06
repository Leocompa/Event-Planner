import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    // Stati per gestire i dati dell'utente e lo stato del login
    const [email, setEmail] = useState(''); // Stato per memorizzare l'email dell'utente
    const [password, setPassword] = useState(''); // Stato per memorizzare la password
    const [error, setError] = useState(null); // Stato per memorizzare eventuali errori durante il login
    const [isLoading, setIsLoading] = useState(false); // Stato per gestire il caricamento del login
    const navigate = useNavigate(); // navigazione tra le pagine

    // Funzione per gestire il submit del form di login
    const handleSubmit = async (e) => {
        e.preventDefault(); // Previene il comportamento di default del form
        setIsLoading(true); // Inizia il caricamento
        setError(null); // Reset dell'errore

        // Controllo di validità dell'email usando una regular expression
        if (!/\S+@\S+\.\S+/.test(email)) {  
            setError('Please enter a valid email address'); // Mostra un errore se l'email non è valida
            setIsLoading(false); // Ferma il caricamento
            return;
        }
    
        try {
            // Effettua la richiesta di login al server con l'email e la password
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Indica che i dati sono in formato JSON
                },
                body: JSON.stringify({ email, password }), // dati dell'utente
            });
    
            // Se la risposta del server non è ok, gestisci l'errore
            if (!response.ok) {
                const errorData = await response.json(); // Prende i dati dell'errore dalla risposta
                setError(errorData.message || 'Error during login'); // Imposta il messaggio d'errore
                setIsLoading(false); // Ferma il caricamento
                return;
            }
    
            // Se il login ha successo, ottieni i dati dal server
            const data = await response.json();
            onLogin(data.token, data.username); // Passa il token e il nome utente al componente genitore
            setEmail(''); // Reset dell'email
            setPassword(''); // Reset della password
            setError(null); // Reset dell'errore
            navigate('/'); // Naviga alla home page dopo il login
        } catch (error) {
            // Gestisce gli errori della richiesta
            setError('An error occurred during login');
        } finally {
            setIsLoading(false); // Ferma il caricamento al termine dell'operazione (sia in caso di successo che di errore)
        }
    };
    
    return (
        <div className="form-container">  {/* Contenitore principale del form */}
            <h2>Login</h2>  {/* Titolo del form */}
            <form onSubmit={handleSubmit}>  {/* Gestisce il submit del form */}
                {error && <div className="error-message">{error}</div>}  {/* Mostra eventuali errori */}
                
                {/* Campo per l'email */}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email} // Valore dell'input
                        onChange={(e) => setEmail(e.target.value)} // Funzione per aggiornare l'email
                        required  // Campo obbligatorio
                        className="form-control"  // Classe per lo stile
                    />
                </div>
                
                {/* Campo per la password */}
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password} // Valore dell'input
                        onChange={(e) => setPassword(e.target.value)} // Funzione per aggiornare la password
                        required  // Campo obbligatorio
                        className="form-control"  // Classe per lo stile
                    />
                </div>
                
                {/* Pulsante per inviare il form */}
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Log In'}  {/* Cambia il testo del pulsante in base allo stato di caricamento */}
                </button>

                {/* Link per il passaggio alla pagina di registrazione */}
                <p className="auth-switch">
                    Don't have an account? <a href="/register">Sign up</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
