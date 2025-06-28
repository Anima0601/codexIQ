// devmate-frontend/src/pages/AuthPage.jsx

import React, { useState } from 'react';
import './AuthPage.css'; // Correct path as both are in src/pages/

const AuthPage = ({ onAuthSuccess }) => {
    const [isLogin, setIsLogin] = useState(true); // True for Login form, false for Register form
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Destructure form data for easier use
    const { username, email, password } = formData;

    // Handles input changes for all form fields
    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Clear errors when user types
        setMessage(null); // Clear success/info messages when user types
    };

    // Handles form submission (Login or Register)
    const onSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setError(null);
        setMessage(null);

        // Determine the API endpoint based on whether it's login or register
        const url = isLogin
            ? 'http://localhost:5000/api/auth/login'
            : 'http://localhost:5000/api/auth/register';

        try {
            // Send data to backend API
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Convert JS object to JSON string
            });

            const data = await response.json(); // Parse the JSON response from the server

            if (!response.ok) {
                // If response status is not 2xx (e.g., 400, 500), it's an error
                setError(data.msg || 'An error occurred'); // Display error message from backend
                console.error('API Error:', data);
                return; // Stop further execution
            }

            // If the request was successful
            if (isLogin) {
                // For successful login, store the JWT token
                localStorage.setItem('token', data.token);
                setMessage('Login successful!');
                // Call the callback function from App.jsx to update authentication state
                if (onAuthSuccess) {
                    onAuthSuccess();
                }
            } else {
                // For successful registration
                setMessage('Registration successful! Please log in.');
                setIsLogin(true); // Automatically switch to the login form
                setFormData({ username: '', email: '', password: '' }); // Clear form fields
            }

        } catch (err) {
            // Handle network errors (e.g., server is down)
            console.error('Fetch Error:', err);
            setError('Network error or server unreachable.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>{isLogin ? 'Login' : 'Register'}</h2> {/* Dynamic heading */}
                {error && <p className="error-message">{error}</p>} {/* Display error message */}
                {message && <p className="success-message">{message}</p>} {/* Display success message */}
                <form onSubmit={onSubmit}>
                    {!isLogin && ( // Username field only for registration
                        <div className="form-group">
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={onChange}
                                required={!isLogin} // Required only if not login form
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-button">
                        {isLogin ? 'Login' : 'Register'} {/* Dynamic button text */}
                    </button>
                </form>
                <p className="toggle-text">
                    {/* Dynamic text for switching between forms */}
                    {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                    <span onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Register' : 'Login'} {/* Dynamic toggle link text */}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default AuthPage;