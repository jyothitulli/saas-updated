// pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUser(res.data.data));

    axios.get('http://localhost:5000/api/projects', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setProjects(res.data.data));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome, {user.fullName} ({user.role})</p>}
      <h2>Projects ({projects.length})</h2>
      {projects.map(p => <div key={p.id}>{p.name}</div>)}
    </div>
  );
}
export default Dashboard;