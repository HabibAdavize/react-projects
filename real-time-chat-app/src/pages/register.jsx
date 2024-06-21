import React, { useState } from "react";
import { auth, db } from '../firebase';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from 'firebase/firestore';

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    displayName: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const getDetails = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };
  1;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.displayName) {
      setError("All fields are required");
      return;
    }

    try {
      const userCredentials = await auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );
      const user = userCredentials.user;
      navigate.push("/chat");
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email
      });
      setSuccess("Registration Successful. proceed to login", res.user);
      setError((prevError) => {
        prevError.style.display = "none";
      });
    } catch (error) {
      console.error("Error during registration", error);
      setError("An error occurred during registration");
    }
  };

  return (
    <div className="register">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="displayName"
            value={form.displayName}
            onChange={getDetails}
            placeholder="Username"
            required
          />
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
          <button type="submit">Register</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}
