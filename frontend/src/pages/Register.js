import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    tenantName: '',
    subdomain: '',
    adminEmail: '',
    adminFullName: '',
    adminPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.adminPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register-tenant', {
        tenantName: formData.tenantName,
        subdomain: formData.subdomain,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
        adminFullName: formData.adminFullName
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Register Your Organization</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            name="tenantName"
            placeholder="Organization Name"
            value={formData.tenantName}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            name="subdomain"
            placeholder="Subdomain"
            value={formData.subdomain}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px' }}
            required
          />
          <small>{formData.subdomain}.yourapp.com</small>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            name="adminEmail"
            type="email"
            placeholder="Admin Email"
            value={formData.adminEmail}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            name="adminFullName"
            placeholder="Admin Full Name"
            value={formData.adminFullName}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            name="adminPassword"
            type="password"
            placeholder="Password"
            value={formData.adminPassword}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={{ width: '100%', padding: '10px' }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white' }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: '20px' }}>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
export default Register;
