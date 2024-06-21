import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/register.jsx";
import Chat from "./pages/chat.jsx"
//import Users from './components/Users';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
