import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import Lottie from "lottie-react";
import Alert from "../assets/animations/alertCircle.json";
import Preloader from "../components/Preloader";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Check if the username is already taken
      //const usersQuery = query(collection(db, 'users'), where('userName', '==', userName));
      //const usersSnapshot = await getDocs(usersQuery);

      //if (!usersSnapshot.empty) {
      //setError('Username is already taken.');
      //setLoading(false);
      //return;
      //}

      // Validate input fields
      if (!userName || !email || !password) {
        setError("Please fill out all fields.");
        setLoading(false);
        return;
      }

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Upload profile picture if it exists
      let profilePictureURL = "";
      if (profilePicture) {
        const profilePictureRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(profilePictureRef, profilePicture);
        profilePictureURL = await getDownloadURL(profilePictureRef);
      }

      // Add user to Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        userName: userName,
        email: user.email,
        profilePicture: profilePictureURL,
      });

      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (error) {
      console.error("Error registering:", error.message);
      setError("Error registering. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div data-aos="fade-left" className="auth-container">
      {loading ? (
        <Preloader />
      ) : (
        <>
          <h2>Register</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <p
                style={{ color: "red", display: "flex", alignItems: "center" }}
              >
                {error}
                <Lottie
                  animationData={Alert}
                  loop={true}
                  autoplay={true}
                  style={{ width: 24, height: 24 }}
                />
              </p>
            )}
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
            <span>Upload Profile Picture:</span>
            <input type="file" onChange={handleFileChange} accept="image/*" />
            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Register;
