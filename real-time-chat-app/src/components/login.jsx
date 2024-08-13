import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Preloader from '../components/Preloader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      // Use a timeout to simulate loading transition
      setTimeout(() => {
        navigate('/chat');
      }, 1000);

    } catch (error) {
      console.error("Error logging in:", error);
      setError('Failed to log in. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div data-aos="fade-right" className="auth-container">
      {loading ? (
        <Preloader /> 
      ) : (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Login</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
