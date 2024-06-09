import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.jsx";
import { Link } from 'react-router-dom';

export default function login() {
  const [getForm, setGetForm] = useState([{ email: "", password: "" }]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getDetails = (e) => {
    const { name, value } = e.target;
    setGetForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!getForm.email || !getForm.password) {
      setError("All fields are required");
      return;
    }
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        getForm.email,
        getForm.password
      );
      setSuccess("You're logged in", res.user);
    } catch {
      console.error("Error during login", error);
      setError("Invalid email or password");
    }
  };
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
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={getForm.password}
            onChange={getDetails}
            placeholder="Password"
          />
          <button>Login</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
      </div>
    </div>
  );
}
