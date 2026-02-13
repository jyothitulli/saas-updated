import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('Demo@123');
  const [subdomain, setSubdomain] = useState('demo');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email, password, tenantSubdomain: subdomain
      });
      localStorage.setItem('token', res.data.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Login failed. Check credentials.');
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            placeholder="Subdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            style={{ width: '100%', padding: '10px' }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white' }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: '20px' }}>
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
}
export default Login;
