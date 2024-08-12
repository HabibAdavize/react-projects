
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { currentUser } = useAuth();

  const handleLogout = () => {
    signOut(auth);
  };

  return (
    <div className="nav-wrapper">
      <h1>React Chat System</h1>
      <nav>
      {currentUser ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <div className='btn-wrapper'>
          <Link to="/"><button className='btn'>Login</button></Link>
          <Link to="/register"><button className='btn'>Register</button></Link>
        </div>
      )}
    </nav>
    </div>
  );
};

export default Navbar;
