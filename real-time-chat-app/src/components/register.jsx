// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

const Register = () => {
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let profilePictureURL = '';
      if (profilePicture) {
        const profilePictureRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(profilePictureRef, profilePicture);
        profilePictureURL = await getDownloadURL(profilePictureRef);
      }

      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        userName: userName,
        email: user.email,
        profilePicture: profilePictureURL,
      });

      navigate('/chat');
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div data-aos="fade-left" className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Username"
          required
        />
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
        <span>Upload Profile:</span>
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*"
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
