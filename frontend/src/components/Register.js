import React, { useState } from 'react';
import './Register.css';

const Register = ({ onRegister }) => {
    // Dichiarazione degli stati locali per gestire l'input dell'utente e lo stato di errore
    const [email, setEmail] = useState(''); // Stato per l'email dell'utente
    const [password, setPassword] = useState(''); // Stato per la password dell'utente
    const [confirmPassword, setConfirmPassword] = useState(''); // Stato per la conferma della password
    const [error, setError] = useState(null); // Stato per gli eventuali errori di validazione
    const [isLoading, setIsLoading] = useState(false); // Stato per gestire il caricamento (per quando l'utente invia il modulo)

    // Funzione per gestire l'invio del modulo di registrazione
    const handleSubmit = async (e) => {
        e.preventDefault();  // evitare il refresh della pagina

        // Verifica che le password corrispondano
        if (password !== confirmPassword) {
            setError('Passwords do not match');  // Imposta un errore se le password non corrispondono
            return;
        }

        // Verifica che la password sia di almeno 6 caratteri
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');  // Imposta un errore se la password è troppo corta
            return;
        }

        setError(null);  // Rimuove gli errori precedenti
        setIsLoading(true);  // Imposta lo stato di caricamento a true

        const userData = { email, password };  // Prepara i dati dell'utente da inviare al server

        try {
            // Chiama la funzione onRegister passata come prop per eseguire la registrazione
            await onRegister(userData);
            setEmail('');  // Resetta il campo email
            setPassword('');  // Resetta il campo password
            setConfirmPassword('');  // Resetta il campo di conferma password
        } catch (err) {
            setError('Error during registration');  // Imposta un errore se la registrazione fallisce
        } finally {
            setIsLoading(false);  // Ferma lo stato di caricamento, indipendentemente dal risultato
        }
    };

    // le password corrispondono e sono lunghe almeno 6 caratteri
    const isFormValid = password === confirmPassword && password.length >= 6;

    return (
        <div className="form-container">
            <h2>Registration</h2>  {/* Titolo del modulo di registrazione */}
            <form onSubmit={handleSubmit} className="auth-form"> {/* Gestisce l'invio del modulo */}
                {error && <div className="error-message">{error}</div>}  {/* Mostra eventuali errori */}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}  // Collega il valore del campo email allo stato
                        onChange={(e) => setEmail(e.target.value)}  // Aggiorna lo stato quando l'utente scrive
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}  // Collega il valore del campo password allo stato
                        onChange={(e) => setPassword(e.target.value)}  // Aggiorna lo stato quando l'utente scrive
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}  // Collega il valore del campo di conferma password allo stato
                        onChange={(e) => setConfirmPassword(e.target.value)}  // Aggiorna lo stato quando l'utente scrive
                        required
                        className="form-control"
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading || !isFormValid}  // Disabilita il pulsante se il form non è valido o se è in corso il caricamento
                >
                    {isLoading ? 'Loading...' : 'Register'}  {/* Mostra "Loading..." durante il processo di registrazione */}
                </button>
                <p className="auth-switch">
                    Already have an account? <a href="/login">Login</a>  {/* Link per il login se l'utente ha già un account */}
                </p>
            </form>
        </div>
    );
};

export default Register;
