import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        const projectRes = await axios.get(`http://localhost:5000/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProject(projectRes.data.data);

        const tasksRes = await axios.get(`http://localhost:5000/api/tasks?projectId=${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasksRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Status: {project.status}</p>
      
      <h2>Tasks</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Title</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Priority</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Assigned To</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{task.title}</td>
              <td style={{ padding: '10px' }}>{task.status}</td>
              <td style={{ padding: '10px' }}>{task.priority}</td>
              <td style={{ padding: '10px' }}>{task.assignee?.full_name || 'Unassigned'}</td>
              <td style={{ padding: '10px' }}>{task.due_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ProjectDetail;
