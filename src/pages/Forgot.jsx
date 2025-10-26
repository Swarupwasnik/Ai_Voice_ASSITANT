import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Forgot.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.email;
  };

  const handleResetPassword = async () => {
    if (!isFormValid()) {
      // Add shake animation to form
      const formContainer = document.getElementById("forgot-password-form-container");
      if (formContainer) {
        formContainer.style.animation = "shake 0.5s";
        setTimeout(() => {
          formContainer.style.animation = "";
        }, 500);
      }

      setToast({ show: true, message: "Please enter your email address" });
      return;
    }

    setIsLoading(true);

    // Simulate password reset process
    setTimeout(() => {
      setIsLoading(false);
      setToast({ show: true, message: "Password reset link has been sent to your email!" });
      // Navigate back to login after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }, 1500);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        {/* Form Section - Exact same styling as other forms */}
        <div className="form-section">
          <div className="form-header">
            <h3 style={{ color: 'greenyellow' }}>
              <i className="fas fa-key"></i> Reset Password
            </h3>
            <p>
              Enter your email to receive a password reset link
            </p>
          </div>

          <div className="content">
            <div className="form-container" id="forgot-password-form-container">
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="Enter your registered email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <button
                  style={{ color: 'yellowgreen' }}
                  className="btn-start"
                  onClick={handleResetPassword}
                  disabled={!isFormValid() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Sending Reset Link...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i> Send Reset Link
                    </>
                  )}
                </button>
              </div>

              <div className="form-row">
                <div className="form-group full-width" style={{ textAlign: 'center', marginTop: '15px' }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '13px', margin: 0 }}>
                    Remember your password?{' '}
                    <button 
                      type="button" 
                      onClick={handleBackToLogin}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'rgba(102, 126, 234, 0.9)',
                        cursor: 'pointer',
                        fontWeight: '700'
                      }}
                    >
                      Back to Login
                    </button>
                  </p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width" style={{ textAlign: 'center' }}>
                  <div style={{ 
                    padding: '12px', 
                    background: 'rgba(255, 193, 7, 0.1)', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    marginTop: '10px'
                  }}>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      margin: '0 0 4px 0' 
                    }}>
                      <i className="fas fa-info-circle"></i> Important
                    </p>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontSize: '12px', 
                      margin: 0 
                    }}>
                      Check your spam folder if you don't see the email within 5 minutes
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

export default ForgotPassword;