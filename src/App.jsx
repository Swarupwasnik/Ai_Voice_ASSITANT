import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login';
import ForgotPassword from './pages/Forgot';
import UnlockUser from './pages/Unlockuser';
import ChatDashboard from './pages/ChatDashboard';
import Dashboard from './pages/Dashboard';
import CallHistory from './pages/CallHistory';
import Settings from './pages/Settings';
import Home from "./pages/home";

import './styles/layout.css';

const AppContent = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={
          <>
            <Header />
            <main className="main-content">
              <Home />
            </main>
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Header />
            <main className="main-content">
              <Login />
            </main>
            <Footer />
          </>
        } />
        <Route path="/forgot-password" element={
          <>
            <Header />
            <main className="main-content">
              <ForgotPassword />
            </main>
            <Footer />
          </>
        } />
        <Route path="/unlock-user" element={
          <>
            <Header />
            <main className="main-content">
              <UnlockUser />
            </main>
            <Footer />
          </>
        } />
        
        {/* Protected routes with dashboard layout */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <DashboardLayout user={user} onLogout={logout}>
              <Dashboard />
            </DashboardLayout>
          ) : (
            <>
              <Header />
              <main className="main-content">
                <Login />
              </main>
              <Footer />
            </>
          )
        } />
        {/* Original chat route - no auth required */}
        <Route path="/chat" element={
          <>
            <Header />
            <main className="main-content">
              <ChatDashboard />
            </main>
            <Footer />
          </>
        } />
        
        {/* Dashboard chat route - auth required */}
        <Route path="/dashboard/chat" element={
          isAuthenticated ? (
            <DashboardLayout user={user} onLogout={logout}>
              <ChatDashboard />
            </DashboardLayout>
          ) : (
            <>
              <Header />
              <main className="main-content">
                <Login />
              </main>
              <Footer />
            </>
          )
        } />
        <Route path="/history" element={
          isAuthenticated ? (
            <DashboardLayout user={user} onLogout={logout}>
              <CallHistory />
            </DashboardLayout>
          ) : (
            <>
              <Header />
              <main className="main-content">
                <Login />
              </main>
              <Footer />
            </>
          )
        } />
        <Route path="/analytics" element={
          isAuthenticated ? (
            <DashboardLayout user={user} onLogout={logout}>
              <Dashboard />
            </DashboardLayout>
          ) : (
            <>
              <Header />
              <main className="main-content">
                <Login />
              </main>
              <Footer />
            </>
          )
        } />
        <Route path="/settings" element={
          isAuthenticated ? (
            <DashboardLayout user={user} onLogout={logout}>
              <Settings />
            </DashboardLayout>
          ) : (
            <>
              <Header />
              <main className="main-content">
                <Login />
              </main>
              <Footer />
            </>
          )
        } />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
