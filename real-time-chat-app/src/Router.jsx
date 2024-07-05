// src/App.js
import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { AuthProvider } from "./contexts/AuthContext";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const AppRouter = () => {
  useEffect(() => {
    AOS.init({ duration: 700 });
  }, []);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRouter;
