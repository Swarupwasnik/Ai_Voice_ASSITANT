

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import ForgotPassword from './pages/Forgot'; // Import the ForgotPassword component
import UnlockUser from './pages/Unlockuser'; // Import the UnlockUser component
import ChatDashboard from './pages/ChatDashboard'; 
import Home from "./pages/home"

import './styles/layout.css';
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/unlock-user" element={<UnlockUser />} />
            <Route path="/chat" element={<ChatDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
