import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa da 'react-dom/client'
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Importa AuthProvider
import { BrowserRouter } from 'react-router-dom'; // Importa BrowserRouter

// Crea un root per l'app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderizza l'app all'interno del root
root.render(
    <BrowserRouter>
        <AuthProvider>
            <App />
        </AuthProvider>
    </BrowserRouter>
);
