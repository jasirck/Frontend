import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [User, setUser] = useState({ username: '', password: '' });
  const [Error, setError] = useState(''); 
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    navigate('dashboard')
    // Perform form validation or other checks here
    try {
      // Simulate login or add your login logic here
      console.log('User logged in:', User);
    } catch (error) {
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={User.username}
          onChange={(e) => setUser({ ...User, username: e.target.value })}
          required
        />
        
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={User.password}
          onChange={(e) => setUser({ ...User, password: e.target.value })}
          required
        />
        
        {Error && <p className="error">{Error}</p>} 
        
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a onClick={() => navigate('/register')}>Register</a></p>
    </div>
  );
}

export default Login;
