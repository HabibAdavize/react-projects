import React, { useState } from "react";
import { auth} from '../firebase';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getDetails = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await auth.signInWithEmailAndPassword(form.email, form.password);
      navigate.push('/chat');
      console.log("User logged in:", res.user);
    } catch (error) {
      console.error("Error during login", error);
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={getDetails}
            placeholder="Email"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={getDetails}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
