import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
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

  const createUserProfile = async (user) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        userName: user.displayName || "",
        email: user.email,
        profilePicture: user.photoURL || "",
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw new Error("Failed to create user profile.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
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

      // Update the user's profile in Firebase Authentication
      await updateProfile(user, {
        displayName: userName,
        photoURL: profilePictureURL,
      });

      // Create or update the user's profile in Firestore
      await createUserProfile(user);

      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (error) {
      console.error("Error registering:", error.message);
      setError("Error registering. Please try again.");
    } finally {
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
            <span className="btn-span">
              <button type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </span>
          </form>
        </>
      )}
    </div>
  );
};

export default Register;
