import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle admin login
  const handleLogin = (e) => {
    e.preventDefault();

    // Admin credentials check (You can add more complex checks or API call here)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('token', 'admin-token'); // Store token in localStorage
      navigate('/hall'); // Redirect to the admin panel
    } else {
      alert('Invalid credentials. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1>Admin Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleInputChange}
          required
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleInputChange}
          required
          style={{
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '1rem'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
