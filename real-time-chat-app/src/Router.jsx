import { useState } from "react";
import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={Login}>
          <Route index element={Login} />
          <Route path="/login" element={Login} />
          <Route path="/register" element={Register} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
