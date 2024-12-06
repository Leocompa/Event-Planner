import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Stato utente
    const [loading, setLoading] = useState(true); // Stato di caricamento per verificare il token
    const [error, setError] = useState(null); // Stato per gestire eventuali errori

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        
        if (token && username) {
            setUser({ token, username });
        }

        setLoading(false); // Dopo aver controllato il token, impostare il caricamento su false
    }, []);

    const login = (token) => {
        try {
            const username = "dummyUsername"; 
            localStorage.setItem('token', token);
            localStorage.setItem('username', username); // Salvare anche il nome utente
            setUser({ token, username }); // Salvare l'utente nello stato
            setError(null); // Cancellare eventuali errori precedenti
        } catch (err) {
            setError('Si è verificato un errore durante il login');
        }
    };

    const logout = () => {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setUser(null); // Rimuovere l'utente dallo stato
            setError(null); // Cancellare eventuali errori precedenti
        } catch (err) {
            setError('Si è verificato un errore durante il logout');
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, error }}>
            {!loading ? children : <div>Caricamento...</div>} {/* Mostra i children solo quando il caricamento è completato */}
        </AuthContext.Provider>
    );
};
