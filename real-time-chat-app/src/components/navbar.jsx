
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
        <>
          <Link to="/">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
    </div>
  );
};

export default Navbar;
