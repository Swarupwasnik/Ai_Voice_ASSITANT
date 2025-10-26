import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css"

const UnlockUser = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    reason: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return formData.email && formData.reason;
  };

  const handleUnlockRequest = async () => {
    if (!isFormValid()) {
      // Add shake animation to form
      const formContainer = document.getElementById("unlock-user-form-container");
      if (formContainer) {
        formContainer.style.animation = "shake 0.5s";
        setTimeout(() => {
          formContainer.style.animation = "";
        }, 500);
      }

      const missingFields = [];
      if (!formData.email) missingFields.push("Email");
      if (!formData.reason) missingFields.push("Reason");

      setToast({ show: true, message: "Please fill in the following fields: " + missingFields.join(", ") });
      return;
    }

    setIsLoading(true);

    // Simulate unlock request process
    setTimeout(() => {
      setIsLoading(false);
      setToast({ show: true, message: "Unlock request submitted! Our support team will contact you shortly." });
      // Navigate back to login after success
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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
              <i className="fas fa-lock-open"></i> Unlock Account
            </h3>
            <p>
              Request to unlock your suspended account
            </p>
          </div>

          <div className="content">
            <div className="form-container" id="unlock-user-form-container">
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

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="reason">Reason for Unlock Request</label>
                  <select
                    id="reason"
                    className="form-control"
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                  >
                    <option value="">Select a reason</option>
                    <option value="forgot_password">Multiple Failed Login Attempts</option>
                    <option value="suspicious_activity">Suspicious Activity Detected</option>
                    <option value="account_inactivity">Account Inactivity</option>
                    <option value="other">Other Reason</option>
                  </select>
                </div>
              </div>

              {formData.reason === 'other' && (
                <div className="form-row">
                  <div className="form-group full-width">
                    <label htmlFor="additionalInfo">Additional Information</label>
                    <textarea
                      id="additionalInfo"
                      className="form-control"
                      placeholder="Please provide additional details about your unlock request..."
                      rows="3"
                      style={{
                        resize: 'vertical',
                        minHeight: '80px'
                      }}
                    ></textarea>
                  </div>
                </div>
              )}

              <div className="form-group full-width">
                <button
                  style={{ color: 'yellowgreen' }}
                  className="btn-start"
                  onClick={handleUnlockRequest}
                  disabled={!isFormValid() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Submitting Request...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-unlock"></i> Request Account Unlock
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
                    background: 'rgba(255, 152, 0, 0.1)', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255, 152, 0, 0.3)',
                    marginTop: '10px'
                  }}>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.9)', 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      margin: '0 0 4px 0' 
                    }}>
                      <i className="fas fa-clock"></i> Processing Time
                    </p>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      fontSize: '12px', 
                      margin: 0 
                    }}>
                      Unlock requests are typically processed within 2-4 business hours
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

export default UnlockUser;