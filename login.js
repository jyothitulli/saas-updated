// pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('Demo@123');
  const [subdomain, setSubdomain] = useState('demo');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email, password, tenantSubdomain: subdomain
      });
      localStorage.setItem('token', res.data.data.token);
      alert('Login successful!');
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" /><br/>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Password" /><br/>
        <input value={subdomain} onChange={(e)=>setSubdomain(e.target.value)} placeholder="Subdomain" /><br/>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
export default Login;