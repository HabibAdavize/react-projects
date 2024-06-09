import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

export default function Register() {
  const [form, setForm] = useState({ email: "", password: "", displayName: "" });
  const [error, setError] = useState("");
  const[success, setSuccess] = useState("")

  const getDetails = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };1

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password || !form.displayName) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, form.email, form.password);
      await updateProfile(res.user, {
        displayName: form.displayName,
      });
      setSuccess("Registration Successful. proceed to login", res.user);
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </div>
    </div>
  );
}
