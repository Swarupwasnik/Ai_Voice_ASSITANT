import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "../styles/login.css"

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.email && formData.password;
  };

  const handleLogin = async () => {
    if (!isFormValid()) {
      // Add shake animation to form
      const formContainer = document.getElementById("login-form-container");
      if (formContainer) {
        formContainer.style.animation = "shake 0.5s";
        setTimeout(() => {
          formContainer.style.animation = "";
        }, 500);
      }

      const missingFields = [];
      if (!formData.email) missingFields.push("Email");
      if (!formData.password) missingFields.push("Password");

      setToast({ show: true, message: "Please fill in the following fields: " + missingFields.join(", ") });
      return;
    }

    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Login user through context
      const userData = {
        name: 'Demo User',
        email: formData.email,
        role: 'admin'
      };
      login(userData);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        {/* Form Section - Exact same styling as Home form */}
        <div className="form-section">
          <div className="form-header">
            <h3 style={{ color: 'greenyellow' }}>
              <i className="fas fa-shield-alt"></i> Secure Login
            </h3>
            <p>
              Enter your credentials to access the AI Voice platform
            </p>
          </div>

          <div className="content">
            <div className="form-container" id="login-form-container">
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link
                    to="/unlock-user"
                    className="forgot-password-link"
                    style={{ fontSize: '13px', fontWeight: '600' }}
                  >
                    Account Locked?
                  </Link>
                  <Link
                    to="/forgot-password"
                    className="forgot-password-link"
                    style={{ fontSize: '13px', fontWeight: '600' }}
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="form-group full-width">
                <button
                  style={{ color: 'yellowgreen' }}
                  className="btn-start"
                  onClick={handleLogin}
                  disabled={!isFormValid() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Signing In...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt"></i> Login to Dashboard
                    </>
                  )}
                </button>
              </div>

              <div className="form-row">
                <div className="form-group full-width" style={{ textAlign: 'center', marginTop: '15px' }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', margin: 0 }}>
                    Don't have an account?
                    <Link
                      to="/signup" // Assuming you have or will have a signup route
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(102, 126, 234, 0.9)',
                        cursor: 'pointer',
                        fontWeight: '700',
                        paddingLeft: '5px'
                      }}
                    >Sign up here</Link>
                  </p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width" style={{ textAlign: 'center' }}>
                  <div style={{ 
                    padding: '12px', 
                    background: 'rgba(102, 126, 234, 0.1)', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    marginTop: '10px'
                  }}>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      margin: '0 0 4px 0' 
                    }}>
                      Demo Access
                    </p>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontSize: '12px', 
                      margin: 0 
                    }}>
                      Use any email and password to login
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;