import React, { useState } from 'react';
import Login from './loginForm';
import API_URL from '../../../config'; 

const App = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleLogin = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                setToken(data.token);
            } else {
                alert(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    const handlePasswordReset = async (email) => {
        try {
            const response = await fetch(`${API_URL}/auth/password-reset/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Recovery email sent. Please check your inbox.');
            } else {
                alert(data.message || 'Password reset request failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            alert('An unexpected error occurred. Please try again later.');
        }
    };

    return (
        <div>
            {!token ? (
                <Login onLogin={handleLogin} onPasswordReset={handlePasswordReset} />
            ) : (
                <div>
                    <h1>Welcome</h1>
                    <button onClick={() => { localStorage.removeItem('token'); setToken(null); }}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;