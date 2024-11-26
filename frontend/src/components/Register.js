import React, { useState } from 'react';
import './Register.css';

const Register = ({ onRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Additional password validation
        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setError(null);
        setIsLoading(true);

        const userData = { email, password };

        try {
            // Call the onRegister function passed as a prop
            await onRegister(userData);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError('Error during registration');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = password === confirmPassword && password.length >= 6;

    return (
        <div className="form-container">
            <h2>Registration</h2>
            <form onSubmit={handleSubmit} className="auth-form">
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading || !isFormValid}>
                    {isLoading ? 'Loading...' : 'Register'}
                </button>
                <p className="auth-switch">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
