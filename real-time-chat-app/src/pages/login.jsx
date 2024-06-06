import React from "react";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase.jsx';

export default function login() {
  const [getForm, setGetForm] = React.useState([{email:"", password:""}]);
  const [user, setUser] = React.useState(null)
  const [error, setError] = React.useState(false);

  const getDetails = (e) => {
    const {name, value} = e.target;
    setGetForm((prevGetForm) => {
        return [...prevGetForm, { [name]: value}];
    })
  };
  const handleSubmit = (e) =>{
    e.preventDefault();

    if (!getForm.email || !getForm.password) {
        setError("All fields are required");
        return;
      }
    console.log("Form submitted:");
  }
  return (
    <div className="login">
      <div className="form-wrapper">
        <span></span>
        <form onSubmit={handleSubmit}>
          
          <input
            type="email"
            name="email"
            value={getForm.email}
            onChange={getDetails}
            id=""
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={getForm.password}
            onChange={getDetails}
            id=""
            placeholder="Password"
          />
          <button>Login</button>
        </form>
        {error && <p>An erroe occured</p>}
        
      </div>
    </div>
  );
}
