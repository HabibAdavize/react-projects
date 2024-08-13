import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Lottie from "lottie-react";
import Preloader from "../components/Preloader";
import Visibility from "../assets/animations/visibility.json";
import Alert from "../assets/animations/alertCircle.json"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Use a timeout to simulate loading transition
      setTimeout(() => {
        navigate("/chat");
      }, 1000);
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Failed to log in. Please check your credentials.");
      setLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div data-aos="fade-right" className="auth-container">
      {loading ? (
        <Preloader />
      ) : (
        <>
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            {error && (
              <p style={{ color: "red", display: "flex", alignItems:"center", }}>
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <div className="passinput-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <div
                onClick={togglePasswordVisibility}
                className="visibility-icon"
              >
                <Lottie
                  animationData={Visibility}
                  loop={showPassword ? true : false}
                  autoplay={false}
                  direction={showPassword ? 1 : -1} // Adjust animation based on showPassword state
                  style={{ width: 24, height: 24 }}
                />
              </div>
            </div>
            <button type="submit">Login</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Login;
