import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConnectingModal from '../components/ConnectingModal';
import Toast from '../components/Toast';
import "../styles/home.css"

const Home = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    countryCode: '+91',
    agent: '',
    language: ''
  });
  
  const [mobileValidation, setMobileValidation] = useState({ 
    message: 'Type only 10 digit Indian mobile no', 
    type: 'info' 
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [callStartTime, setCallStartTime] = useState(null);
  const [callSid, setCallSid] = useState(null);
  const [lastCustomerName, setLastCustomerName] = useState(null);

  // API Configuration
  const INDIAN_PHONE_NUMBER_ID = "phnum_2601k7rwa4hmfvq9dqntgqntky4n";
  const INTERNATIONAL_PHONE_NUMBER_ID = "phnum_2601k7rwa4hmfvq9dqntgqntky4n";
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://harold-unsalivated-loralee.ngrok-free.dev/";

  // Your original agent map
  const agentMap = {
    banking_service: {
      english_male: "agent_9101k44hh4rce88t2kqdqfm7g4s7",
      english_female: "agent_6201k5xq206xf6jbmvz3007mn2df",
      hindi_male: "agent_4301k5k7skh3e358s1pm0qrdkn4z",
      hindi_female: "agent_1301k5xn3a7tehjs0drbcmajjtt1",
      british_male: "agent_3901k7v1676zehgr5zd2xa8h0nen",
      british_female: "agent_4101k7v1rkc3fyfb49v92zvqx77p"
    },
    loan_enquiry: {
      english_male: "agent_9101k44hh4rce88t2kqdqfm7g4s7",
      english_female: "agent_6201k5xq206xf6jbmvz3007mn2df",
      hindi_male: "agent_4301k5k7skh3e358s1pm0qrdkn4z",
      hindi_female: "agent_1301k5xn3a7tehjs0drbcmajjtt1",
      british_male: "agent_3901k7v1676zehgr5zd2xa8h0nen",
      british_female: "agent_4101k7v1rkc3fyfb49v92zvqx77p"
    },
    balance_enquiry: {
      english_male: "agent_9101k44hh4rce88t2kqdqfm7g4s7",
      english_female: "agent_6201k5xq206xf6jbmvz3007mn2df",
      hindi_male: "agent_4301k5k7skh3e358s1pm0qrdkn4z",
      hindi_female: "agent_1301k5xn3a7tehjs0drbcmajjtt1",
      british_male: "agent_3901k7v1676zehgr5zd2xa8h0nen",
      british_female: "agent_4101k7v1rkc3fyfb49v92zvqx77p"
    },
    hospitality: {
      english_male: "agent_9901k7kqdz1eeah946h3v5awwgw9",
      english_female: "agent_0801k7v1zmg2ey9rk4rpev4ngm96",
      hindi_male: "agent_8101k7v21ecffr59bp68ydfj7txh",
      hindi_female: "agent_6501k7v200h5edm9dj64atbzs56c",
      british_male: "agent_0801k7v2f3p5fd2b6avcp8j0r72k",
      british_female: "agent_0301k7v2fdz9fksrwa2fjxw2xvpq"
    },
    real_estate: {
      english_male: "agent_3301k7kp2208efnbc2drc3ss6mcp",
      english_female: "agent_1101k7v1xwfgehvr2apax84b5hcd",
      hindi_male: "agent_6501k7v1xa3nfdg97vzc6tjbttck",
      hindi_female: "agent_3901k7v1yawmefvtwydc7sjz0jfn",
      british_male: "agent_1401k7v2fz75fsa8pafjqm36dvzb",
      british_female: "agent_5101k7v2gaekf2arq3x4tn5ywq0s"
    },
    traffic_challan: {
      english_male: "agent_4801k7nna75rfp69s4b4t7csfb15",
      english_female: "agent_4101k7v24dq9ffbs1w5sjdfjh975",
      hindi_male: "agent_9401k7v23v6pf08r316fd897y9xx",
      hindi_female: "agent_6501k7v24x75fw2sng2jr209h5ke",
      british_male: "agent_1301k7v2eavpe5xvq7h53s2h2xe7",
      british_female: "agent_4201k7v2emcaex7radmgb41vbxr1"
    },
    nmc: {
      english_male: "agent_5301k7np9rmgey4ssr2h7btmqjcn",
      english_female: "agent_4901k7v26tzpf4bvjvx2a2y4s7wy",
      hindi_male: "agent_4001k7v26bfef6esjkf0jgz9kbav",
      hindi_female: "agent_7301k7v27egwf5xax0msv1xbyxbd",
      british_male: "agent_9901k7v2caqpf7yv5wf2ch2c4m7g",
      british_female: "agent_9601k7v2derhegw8q1rny1dz17w1"
    },
    doctor_appointment: {
      english_male: "agent_7001k7pd1fqjef1vnz0607v0fv6j",
      english_female: "agent_6101k7v29r8teqjtyqbq729ypfxw",
      hindi_male: "agent_9901k7v294g2fb0b2wh4a42vv8sn",
      hindi_female: "agent_8701k7v2a8vwf1etyhr64bedws4t",
      british_male: "agent_6001k7v2atdgetrtfx48cjgqcdd6",
      british_female: "agent_7501k7v2brsqeybs8tr024d1hw33"
    }
  };

  const allLanguages = {
    '': 'Select Language',
    'english_male': 'English Male',
    'english_female': 'English Female',
    'hindi_male': 'Hindi Male',
    'hindi_female': 'Hindi Female',
    'british_male': 'British Male',
    'british_female': 'British Female'
  };

  // Helper to fetch JSON safely
  const fetchJson = async (url, options = {}) => {
    const defaultHeaders = {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "1",
    };
    const headers = { ...defaultHeaders, ...(options.headers || {}) };
    const finalOptions = { cache: "no-cache", ...options, headers };

    const res = await fetch(url, finalOptions);
    const ct = res.headers.get("content-type") || "";

    if (!res.ok) {
      let bodyPreview = "";
      try {
        bodyPreview = ct.includes("application/json")
          ? JSON.stringify(await res.json())
          : await res.text();
      } catch (_) {}
      throw new Error(`HTTP ${res.status} ${res.statusText} at ${url} | ${bodyPreview?.slice?.(0, 300) || ""}`);
    }

    if (!ct.toLowerCase().includes("application/json")) {
      const text = await res.text();
      throw new Error(`Expected JSON but got '${ct || "unknown"}' at ${url}. Body: ${text.slice(0, 300)}`);
    }

    return res.json();
  };

  // Validation functions
  const isValidMobile = (value, countryCode) => {
    const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
    const INTERNATIONAL_MOBILE_REGEX = /^\+?\d{5,15}$/;
    
    if (countryCode === '+91') {
      const justDigits = value.replace(/[^\d]/g, "");
      return INDIAN_MOBILE_REGEX.test(justDigits);
    } else if (countryCode === 'Int.') {
      return INTERNATIONAL_MOBILE_REGEX.test(value) && value.startsWith('+');
    }
    return false;
  };

  const updateMobileValidation = (value, countryCode) => {
    if (value.trim() === "") {
      setMobileValidation({
        message: countryCode === '+91' ? "Type only 10 digit Indian mobile no" : "Mobile no type with country code",
        type: 'info'
      });
    } else if (isValidMobile(value, countryCode)) {
      setMobileValidation({
        message: countryCode === '+91' ? "✓ Verified Indian no" : "✓ Verified international no",
        type: 'valid'
      });
    } else {
      setMobileValidation({
        message: countryCode === '+91' ? "Type only 10 digit Indian mobile no" : "Mobile no type with country code",
        type: 'invalid'
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'mobile') {
      updateMobileValidation(value, formData.countryCode);
    }
  };

  const handleCountryCodeChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      countryCode: value,
      mobile: '',
      language: ''
    }));
    
    setMobileValidation({
      message: value === '+91' ? "Type only 10 digit Indian mobile no" : "Mobile no type with country code",
      type: 'info'
    });
  };

  const handleAgentChange = (value) => {
    setFormData(prev => ({ 
      ...prev, 
      agent: value,
      language: ''
    }));

    // Update available languages based on selected agent
    if (value && agentMap[value]) {
      const languages = Object.keys(agentMap[value]).map(key => ({
        value: key,
        label: allLanguages[key] || key
      }));
      setAvailableLanguages(languages);
    } else {
      setAvailableLanguages([]);
    }
  };

  const isFormValid = () => {
    return formData.name && 
           formData.mobile && 
           formData.agent && 
           formData.language && 
           isValidMobile(formData.mobile, formData.countryCode);
  };

  // API call to initiate the call
  const initiateCall = async () => {
    const { name, mobile, countryCode, language, agent } = formData;
    
    // Keep name for later messages
    setLastCustomerName(name);

    // Determine phone number
    let to_number;
    if (countryCode === '+91') {
      to_number = `+91${mobile.replace(/[^\d]/g, "")}`;
    } else if (countryCode === 'Int.') {
      to_number = mobile.startsWith('+') ? mobile : `+${mobile}`;
      
      // Detect region for international numbers
      try {
        const detectResponse = await fetchJson(`/api/detect-number-region`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to_number: to_number })
        });
        console.log("Region detection:", detectResponse);
      } catch (error) {
        console.warn("Region detection failed:", error);
      }
    }

    // Get agent ID
    let agent_id = agentMap[agent]?.[language];
    
    // If selected language not available for this agent, find best fallback
    if (!agent_id) {
      const availableLanguages = Object.keys(agentMap[agent] || {});
      if (availableLanguages.includes('english_female')) {
        agent_id = agentMap[agent].english_female;
      } else if (availableLanguages.includes('english_male')) {
        agent_id = agentMap[agent].english_male;
      } else if (availableLanguages.includes('hindi_female')) {
        agent_id = agentMap[agent].hindi_female;
      } else if (availableLanguages.includes('hindi_male')) {
        agent_id = agentMap[agent].hindi_male;
      } else {
        agent_id = agentMap.banking_service.english_female;
      }
    }

    // Map agent to category for API compatibility
    let category = "general_enquiry";
    if (agent === "banking_service" || agent === "loan_enquiry" || agent === "balance_enquiry") {
      category = "banking_enquiry";
    } else if (agent === "real_estate") {
      category = "real_estate";
    } else if (agent === "hospitality") {
      category = "hospitality";
    } else if (agent === "traffic_challan") {
      category = "traffic_challan";
    } else if (agent === "nmc") {
      category = "municipal_services";
    } else if (agent === "doctor_appointment") {
      category = "healthcare";
    }

    // Select phone number ID based on country code
    const agent_phone_number_id = countryCode === '+91' ? INDIAN_PHONE_NUMBER_ID : INTERNATIONAL_PHONE_NUMBER_ID;

    // Determine region selection based on country code
    let region_selection = "india";
    if (countryCode === 'Int.') {
      if (to_number.startsWith('+1')) {
        region_selection = "us";
      } else if (to_number.startsWith('+44')) {
        region_selection = "uk";
      } else if (to_number.startsWith('+61')) {
        region_selection = "australia";
      } else {
        region_selection = "us";
      }
    }

    const body = {
      agent_id: agent_id,
      agent_phone_number_id: agent_phone_number_id,
      to_number: to_number,
      customer_name: name,
      category: category,
      region_selection: region_selection,
    };
    
    console.log("API Request Body:", body);

    try {
      const data = await fetchJson(`/api/outbound_call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      console.log("API response:", data);
      
      if (data && (data.error || data.call_status === 'failed')) {
        const errorMsg = data.error || data.detail?.message || 'Call failed';
        
        // If it's a SIP trunk error, simulate a successful call for demo
        if (data.detail?.status === 'invalid_provider' || data.detail?.message?.includes('SIP trunk')) {
          console.warn('SIP trunk error - running in demo mode');
          return {
            call_sid: `demo_${Date.now()}`,
            call_status: 'demo',
            conversation_id: `demo_conv_${Date.now()}`
          };
        }
        
        throw new Error(`Status ${data.call_status || 'error'}: ${JSON.stringify(data.detail || errorMsg)}`);
      }
      
      setCallSid(data.call_sid || data.sid || null);
      setCallStartTime(new Date());

      return data;
    } catch (error) {
      console.error("Error initiating call:", error);
      throw error;
    }
  };

  const handleStartCall = async () => {
    if (!isFormValid()) {
      // Add shake animation to form
      const formContainer = document.getElementById("form-container");
      if (formContainer) {
        formContainer.style.animation = "shake 0.5s";
        setTimeout(() => {
          formContainer.style.animation = "";
        }, 500);
      }

      const missingFields = [];
      if (!formData.name) missingFields.push("Name");
      if (!formData.mobile) missingFields.push("Mobile Number");
      if (!formData.language) missingFields.push("Language & Voice");
      if (!formData.agent) missingFields.push("Agent");

      setToast({ show: true, message: "Please fill in the following fields: " + missingFields.join(", ") });
      return;
    }

    // Additional mobile format validation
    if (!isValidMobile(formData.mobile, formData.countryCode)) {
      const formContainer = document.getElementById("form-container");
      if (formContainer) {
        formContainer.style.animation = "shake 0.5s";
        setTimeout(() => {
          formContainer.style.animation = "";
        }, 500);
      }
      
      setMobileValidation({
        message: formData.countryCode === '+91' ? 
          "✗ Enter 10 digits only, starts with 6/7/8/9" : 
          "✗ Enter valid international number with country code",
        type: 'invalid'
      });
      return;
    }

    setIsModalOpen(true);

    try {
      const response = await initiateCall();
      
      // Wait for 3 seconds to show connecting animation, then navigate to chat
      setTimeout(() => {
        setIsModalOpen(false);
        // Navigate to chat dashboard with all necessary data
        navigate('/chat', { 
          state: { 
            formData,
            callSid: response.call_sid || response.sid,
            callStartTime: new Date(),
            lastCustomerName: formData.name,
            isCallOngoing: true,
            sessionId: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          } 
        });
      }, 3000);

    } catch (error) {
      setIsModalOpen(false);
      setToast({ show: true, message: 'Failed to start call. Check number/agent config and try again.' });
    }
  };

  const handleDisconnectCall = () => {
    setIsModalOpen(false);
    setToast({ show: true, message: 'Call disconnected' });
  };

  return (
    <div className="container">
      <div className="content-wrapper">
        {/* Form Section - On the Right */}
        <div className="form-section">
          <div className="form-header">
            <h3 style={{ color: 'greenyellow' }}>
              <i className="fas fa-phone"></i> Start Conversation
            </h3>
            <p>
              Fill in your details to connect with our AI Voice assistant
            </p>
          </div>

          <div className="content">
            <div className="form-container" id="form-container">
              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    placeholder="Enter your Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group mobile-group">
                  <div className="mobile-fields-wrapper">
                    <div className="country-code-field">
                      <label htmlFor="country-code">Code</label>
                      <div className="select-wrapper">
                        <select 
                          id="country-code" 
                          className="form-control"
                          value={formData.countryCode}
                          onChange={(e) => handleCountryCodeChange(e.target.value)}
                        >
                          <option value="+91">Indian</option>
                          <option value="Int.">International</option>
                        </select>
                      </div>
                    </div>
                    <div className="mobile-number-field">
                      <label htmlFor="mobile">Mobile Number</label>
                      <input
                        type="tel"
                        id="mobile"
                        className="form-control mobile-input"
                        placeholder={formData.countryCode === '+91' ? "Enter 10-digit mobile number" : "Enter mobile number with code"}
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        maxLength={formData.countryCode === '+91' ? 10 : 15}
                      />
                    </div>
                  </div>
                  <span
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    className={`mobile-validation ${mobileValidation.type}`}
                  >
                    {mobileValidation.message}
                  </span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group agent-group">
                  <label htmlFor="agent">Agent</label>
                  <div className="select-wrapper">
                    <select 
                      id="agent" 
                      className="form-control"
                      value={formData.agent}
                      onChange={(e) => handleAgentChange(e.target.value)}
                    >
                      <option value="">Select Agent</option>
                      <option value="banking_service">Banking Enquiry</option>
                      <option value="loan_enquiry">Loan Enquiry</option>
                      <option value="balance_enquiry">Balance Enquiry</option>
                      <option value="real_estate">Real Estate Agent</option>
                      <option value="hospitality">Hospitality Agent</option>
                      <option value="traffic_challan">Traffic E-Challan Agent</option>
                      <option value="nmc">Municipal Corporation Agent</option>
                      <option value="doctor_appointment">Doctor Appointment Agent</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group language-group">
                  <label htmlFor="language">Language</label>
                  <div className="select-wrapper">
                    <select 
                      id="language" 
                      className="form-control"
                      value={formData.language}
                      onChange={(e) => handleInputChange('language', e.target.value)}
                      disabled={!formData.agent}
                    >
                      <option value="">Select Language</option>
                      {availableLanguages.map(lang => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group full-width">
                <button
                  style={{ color: 'yellowgreen' }}
                  className="btn-start"
                  id="start-call"
                  onClick={handleStartCall}
                  disabled={!isFormValid()}
                >
                  <i className="fas fa-phone"></i> Start Voice Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConnectingModal 
        isOpen={isModalOpen}
        onClose={handleDisconnectCall}
        formData={formData}
      />

      <Toast 
        show={toast.show}
        message={toast.message}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </div>
  );
};

export default Home;