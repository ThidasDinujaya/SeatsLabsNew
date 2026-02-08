
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import '../styles/Login.css';

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.auth.login(email, password);
            const { token, user } = response; // Fix: use response directly, not response.data

            // Store token for subsequent API calls
            localStorage.setItem('token', token);

            // Backend returns: { id, email, firstName, lastName, userType }
            const roleName = user.userType;

            const userWithRole = {
                ...user,
                name: `${user.firstName} ${user.lastName}`,
                role: roleName,
            };

            localStorage.setItem('user', JSON.stringify(userWithRole));
            if (onLogin) onLogin(userWithRole);

            // Redirect based on Role
            if (roleName === 'Manager' || roleName === 'Admin') {
                navigate('/admin');
            } else if (roleName === 'Technician') {
                navigate('/admin'); // Or specialized technician dashboard if it exists
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container glass-panel">
                <h2 className="login-title">Welcome Back</h2>
                <p className="login-subtitle">Sign in to manage your vehicle services</p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. john@example.com"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="form-input"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-button cta-button" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Don't have an account? <Link to="/signup" className="link-text">Sign Up</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Login;
