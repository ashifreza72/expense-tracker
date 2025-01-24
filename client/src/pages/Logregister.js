import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import StyleLog from '../styles/StyleLog.css';

function Logregister() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Track if we're on the login or register page
  const [showPassword, setShowPassword] = useState(false); // Handle password visibility toggle
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        {
          email,
          password,
        }
      );
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert('Login failed!');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });
      alert('Registration successful! Please login.');
      setIsLogin(true); // Switch to login after successful registration
    } catch (error) {
      alert('Registration failed!');
    }
  };

  return (
    <div className='auth-container'>
      <div className='auth-card'>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <input
              type='text'
              placeholder='Full Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className='auth-input'
            />
          )}
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='auth-input'
          />
          <div className='password-container'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='auth-input'
            />
            <span
              className='password-toggle'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type='submit' className='auth-button'>
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
        <div className='toggle-auth'>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsLogin(false)}>Register</button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)}>Login</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Logregister;
