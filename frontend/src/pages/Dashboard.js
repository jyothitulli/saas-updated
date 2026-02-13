import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(userRes.data.data);

        const projectsRes = await axios.get('http://localhost:5000/api/projects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProjects(projectsRes.data.data || []);

        if (projectsRes.data.data && projectsRes.data.data.length > 0) {
          const tasksRes = await axios.get(`http://localhost:5000/api/tasks?projectId=${projectsRes.data.data[0].id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTasks(tasksRes.data.data || []);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <nav style={{ background: '#333', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>Multi-Tenant SaaS</h2>
        <div>
          <span style={{ marginRight: '20px' }}>{user.fullName} ({user.role})</span>
          <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: '20px' }}>
        <h1>Dashboard</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '5px' }}>
            <h3>Total Projects</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{projects.length}</p>
          </div>
          <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '5px' }}>
            <h3>Total Tasks</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{tasks.length}</p>
          </div>
          <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '5px' }}>
            <h3>Completed Tasks</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{tasks.filter(t => t.status === 'completed').length}</p>
          </div>
          <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '5px' }}>
            <h3>Pending Tasks</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{tasks.filter(t => t.status !== 'completed').length}</p>
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2>Recent Projects</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {projects.slice(0, 3).map(project => (
              <div key={project.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <p>Status: <span style={{ 
                  background: project.status === 'active' ? 'green' : 'gray', 
                  color: 'white', 
                  padding: '3px 8px', 
                  borderRadius: '3px' 
                }}>{project.status}</span></p>
                <a href={`/projects/${project.id}`}>View Details →</a>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2>My Tasks</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Priority</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{task.title}</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      background: task.status === 'completed' ? 'green' : task.status === 'in_progress' ? 'orange' : 'blue',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '3px'
                    }}>{task.status}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ 
                      background: task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'blue',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '3px'
                    }}>{task.priority}</span>
                  </td>
                  <td style={{ padding: '10px' }}>{task.due_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
