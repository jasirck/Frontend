import React, { useEffect, useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../toolkit/Slice'; 
import axios from '../Api'; 

function Login() {
  const [User, setUser] = useState({ username: '', password: '' }); 
  const [Error, setError] = useState(''); 
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const {token} = useSelector((state)=>(state.authReducer))
  const is_loged = token
  
  useEffect(() => {
    if (is_loged ) {
      console.log(is_loged);
      navigate('/dashboard');
    }
  }, [is_loged, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('login/', {
        username: User.username,
        password: User.password 
      });
      
      const { access } = response.data; 
      dispatch(login({ user: User.username, token: access })); 
      console.log(User, access);
      
      navigate('dashboard'); 
    } catch (error) {
      setError('Login failed. Please try again.'); 
      console.error('Login Error:', error.response ? error.response.data : error.message); // Log more details for debugging
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>User Name</label> {/* Changed from Username to Email */}
        <input
          type="username" // Changed to type email for better user experience
          placeholder="Enter your username" // Updated placeholder
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
