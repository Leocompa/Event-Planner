import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
    
        if (!/\S+@\S+\.\S+/.test(email)) {  // RegEx per validare la email
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }
    
        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Error during login');
                setIsLoading(false);
                return;
            }
    
            const data = await response.json();
            onLogin(data.token, data.username);
            setEmail('');
            setPassword('');
            setError(null);
            navigate('/');
        } catch (error) {
            setError('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };
    

    return (
        <div className="form-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Log In'}
                </button>
                <p className="auth-switch">
                    Don't have an account? <a href="/register">Sign up</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
