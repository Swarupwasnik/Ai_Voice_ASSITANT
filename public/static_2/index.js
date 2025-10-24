document.addEventListener("DOMContentLoaded", function () {
  const startCallBtn = document.getElementById("start-call");
  const disconnectCallBtn = document.getElementById("disconnect-call");
  const newCallBtn = document.getElementById("new-call");
  const modal = document.getElementById("connecting-modal");
  const formContainer = document.getElementById("form-container");
  const chatDashboard = document.getElementById("chat-dashboard");
  const chatMessages = document.getElementById("chat-messages");
  const callDurationEl = document.getElementById("call-duration");
  const mobileInput = document.getElementById("mobile");
  const mobileValidation = document.getElementById("mobile-validation");
  const hamburger = document.getElementById("hamburger-menu");
  const navMenu = document.querySelector(".nav-menu");

  let callSid = null;
  let ws = null;
  let callStartTime = null;
  let callDurationInterval = null;
  let lastCustomerName = null;
  let pollingInterval = null;
  let lastConversationId = null;
  let autoEndPollingInterval = null;
  
  // NEW: Variables for call status polling
  let callStatusPollingInterval = null;
  let currentConversationId = null;

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
  
  const INDIAN_PHONE_NUMBER_ID = "phnum_6401k7kw1kysfpzaggkpdf6g0tfy";
  const INTERNATIONAL_PHONE_NUMBER_ID = "phnum_2601k7rwa4hmfvq9dqntgqntky4n";
  const API_BASE_URL = "https://3d4807d686fc.ngrok-free.app";
  
  // Helper to fetch JSON safely and avoid ngrok interstitials/HTML responses
  async function fetchJson(url, options = {}) {
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
  }
  
  // Mobile nav: toggle via hamburger
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      navMenu.classList.toggle("active");
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
      });
    });

    document.addEventListener("click", function (e) {
      const isClickInside =
        navMenu.contains(e.target) || hamburger.contains(e.target);
      if (!isClickInside) {
        navMenu.classList.remove("active");
      }
    });
  }

  // Collapsible Call Summary (responsive)
  (function initCallSummaryCollapsible() {
    const card = document.getElementById('call-summary-card');
    const toggleBtn = document.getElementById('call-summary-toggle');
    if (!card || !toggleBtn) return;

    function applyResponsiveState() {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      if (isMobile) {
        card.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('open');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    }

    toggleBtn.addEventListener('click', function () {
      const open = card.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', String(open));
    });

    applyResponsiveState();
    window.addEventListener('resize', applyResponsiveState);
  })();

  // Mobile validation helpers
  const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
  const INTERNATIONAL_MOBILE_REGEX = /^\+?\d{5,15}$/;

  function isValidMobile(value, countryCode) {
    if (countryCode === '+91') {
      const justDigits = value.replace(/[^\d]/g, "");
      return INDIAN_MOBILE_REGEX.test(justDigits);
    } else if (countryCode === 'Int.') {
      return INTERNATIONAL_MOBILE_REGEX.test(value) && value.startsWith('+');
    }
    return false;
  }

  function formatMobile(value, countryCode) {
    if (countryCode === '+91') {
      let digits = value.replace(/[^\d]/g, "");
      return digits.slice(0, 10);
    } else {
      return value.replace(/[^\d+]/g, "").slice(0, 15);
    }
  }

  // Function to update start button state
  function updateStartButton() {
    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const countryCode = document.getElementById("country-code").value;
    const language = document.getElementById("language").value;
    const agent = document.getElementById("agent").value;
    const mobileValid = isValidMobile(mobile, countryCode);

    if (name && mobileValid && language && agent) {
      startCallBtn.disabled = false;
    } else {
      startCallBtn.disabled = true;
    }
  }

  // Country code change handler
  const countryCodeSelect = document.getElementById("country-code");
  countryCodeSelect.addEventListener("change", function() {
    const mobile = document.getElementById("mobile");
    if (this.value === '+91') {
      mobile.placeholder = "10-Digit Mobile No.";
      mobile.maxLength = 10;
    } else if (this.value === 'Int.') {
      mobile.placeholder = "Mobile with Code(+XX)";
      mobile.maxLength = 15;
    }
    mobile.value = "";
    mobileValidation.textContent = "";
    mobileValidation.className = "mobile-validation";
    updateStartButton();
  });

  // Mobile number validation and formatting
  mobileInput.addEventListener("input", function () {
    const countryCode = countryCodeSelect.value;
    
    if (countryCode === '+91') {
      let value = this.value.replace(/[^\d]/g, "");
      if (value.length > 0 && !/^[6-9]/.test(value)) {
        value = "";
      }
      this.value = value.slice(0, 10);
    } else if (countryCode === 'Int.') {
      let value = this.value;
      if (!value.startsWith('+') && value.length > 0) {
        value = '+' + value.replace(/[^\d]/g, '');
      }
      this.value = value.replace(/[^\d+]/g, '').slice(0, 15);
    }

    const isValid = isValidMobile(this.value, countryCode);
    if (this.value.trim() === "") {
      mobileValidation.textContent = "";
      mobileValidation.className = "mobile-validation";
    } else if (isValid) {
      mobileValidation.textContent = countryCode === '+91' ? "✓ Verified Indian number" : "✓ Verified international number";
      mobileValidation.className = "mobile-validation valid";
    } else {
      if (countryCode === '+91') {
        mobileValidation.textContent = "Enter 10 digit mobile no.";
      } else {
        mobileValidation.textContent = "Mobile with Country Code";
      }
      mobileValidation.className = "mobile-validation invalid";
    }

    updateStartButton();
  });

  // Dynamic dropdown logic for agent selection
  const agentSelect = document.getElementById("agent");
  const languageSelect = document.getElementById("language");

  const allLanguages = {
    '': 'Select Language',
    'english_male': 'English Male',
    'english_female': 'English Female',
    'hindi_male': 'Hindi Male',
    'hindi_female': 'Hindi Female',
    'british_male': 'British Male',
    'british_female': 'British Female'
  };

  function updateFormFields() {
    const selectedAgent = agentSelect.value;
    languageSelect.innerHTML = '';

    if (!selectedAgent) {
      languageSelect.add(new Option('Select Language', ''));
      languageSelect.value = '';
      updateStartButton();
      return;
    }

    const available = agentMap[selectedAgent] || {};
    const availableKeys = Object.keys(available);

    languageSelect.add(new Option('Select Language', ''));
    availableKeys.forEach(key => {
      if (allLanguages[key]) {
        languageSelect.add(new Option(allLanguages[key], key));
      }
    });

    languageSelect.value = '';
    updateStartButton();
  }

  agentSelect.addEventListener('change', updateFormFields);
  updateFormFields();

  document.getElementById("name").addEventListener("input", updateStartButton);
  document.getElementById("language").addEventListener("change", updateStartButton);
  document.getElementById("country-code").addEventListener("change", updateStartButton);
  document.getElementById("agent").addEventListener("change", updateStartButton);

  updateStartButton();

  // Update call duration
  function updateCallDuration() {
    if (!callStartTime) return;
    const el = document.getElementById("call-duration");
    if (!el) return;
    const now = new Date();
    const diff = Math.floor((now - callStartTime) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    el.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  // Start chat functionality
  startCallBtn.addEventListener("click", async function () {
    const customer_name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const countryCode = document.getElementById("country-code").value;
    const lang_gender = document.getElementById("language").value;
    const agent = document.getElementById("agent").value;

    lastCustomerName = customer_name;

    console.log("Form validation:", {
      customer_name,
      mobile,
      countryCode,
      lang_gender,
      agent,
    });

    if (!customer_name || !mobile || !lang_gender || !agent) {
      formContainer.style.animation = "shake 0.5s";
      setTimeout(() => {
        formContainer.style.animation = "";
      }, 500);

      const missingFields = [];
      if (!customer_name) missingFields.push("Name");
      if (!mobile) missingFields.push("Mobile Number");
      if (!lang_gender) missingFields.push("Language & Voice");
      if (!agent) missingFields.push("Agent");

      alert("Please fill in the following fields: " + missingFields.join(", "));
      return;
    }

    if (!isValidMobile(mobile, countryCode)) {
      formContainer.style.animation = "shake 0.5s";
      setTimeout(() => {
        formContainer.style.animation = "";
      }, 500);
      mobileValidation.textContent = countryCode === '+91' ? 
        "✗ Enter 10 digits only, starts with 6/7/8/9" : 
        "✗ Enter valid international number with country code";
      mobileValidation.className = "mobile-validation invalid";
      return;
    }

    const agentDisplayName = agent.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    const languageDisplayName = allLanguages[lang_gender] || lang_gender;
    
    const modalText = document.getElementById("modal-connection-text");
    if (modalText) {
      modalText.textContent = `${agentDisplayName} (${languageDisplayName}) connecting to ${customer_name}...`;
    }
    
    modal.classList.add("active");

    let to_number;
    
    if (countryCode === '+91') {
      to_number = `+91${mobile.replace(/[^\d]/g, "")}`;
    } else if (countryCode === 'Int.') {
      to_number = mobile.startsWith('+') ? mobile : `+${mobile}`;
      
      try {
        const detectResponse = await fetchJson(`${API_BASE_URL}/api/detect-number-region`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone_number: to_number })
        });
        console.log("Region detection:", detectResponse);
      } catch (error) {
        console.warn("Region detection failed:", error);
      }
    }

    let agent_id = agentMap[agent]?.[lang_gender];
    
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

    const agent_phone_number_id = countryCode === '+91' ? INDIAN_PHONE_NUMBER_ID : INTERNATIONAL_PHONE_NUMBER_ID;

    const body = {
      agent_id: agent_id,
      agent_phone_number_id: agent_phone_number_id,
      to_number: to_number,
      customer_name: customer_name,
      category: category,
    };
    
    console.log("API Request Body:", body);

    try {
      const data = await fetchJson(`${API_BASE_URL}/api/outbound_call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      console.log("ElevenLabs response:", data);
      
      if (data && data.error) {
        throw new Error(data.error);
      }
      
      callSid = data.call_sid || data.sid || null;
      currentConversationId = data.conversation_id;

      console.log("Received conversation_id:", currentConversationId);

      callStartTime = new Date();
      callDurationInterval = setInterval(updateCallDuration, 1000);

      const statusText = document.querySelector(".status-text");
      if (statusText) {
        statusText.textContent = "Call connected! Please wait for the conversation to connect with customer..";
      }
      
      const chatAgentName = document.getElementById("chat-agent-name");
      const chatStatus = document.getElementById("chat-status");
      if (chatAgentName) {
        chatAgentName.textContent = `${agentDisplayName} (${languageDisplayName})`;
      }
      if (chatStatus) {
        chatStatus.textContent = `AI Assistant connected to ${customer_name}`;
      }

      // Start polling for call status (handles both success and failure)
      startCallStatusPolling(currentConversationId);
      
    } catch (error) {
      console.error("Error initiating call:", error);
      modal.classList.remove("active");
      showToast("Failed to start the call. Check number/agent config and try again.");
    }
  });

  // NEW FUNCTION: Poll for call status to detect failures
  function startCallStatusPolling(conversationId) {
    if (callStatusPollingInterval) {
      clearInterval(callStatusPollingInterval);
    }

    if (!conversationId) {
      console.error("No conversation ID provided for status polling");
      return;
    }

    let pollAttempts = 0;
    const maxAttempts = 30; // Poll for 60 seconds (30 attempts × 2 seconds)

    async function checkCallStatus() {
      pollAttempts++;
      
      try {
        console.log(`Checking call status for: ${conversationId} (attempt ${pollAttempts})`);
        
        const statusData = await fetchJson(
          `${API_BASE_URL}/api/call-status/${conversationId}?t=${Date.now()}`
        );
        
        console.log("Call status:", statusData);

        if (statusData.status === "failed") {
          // Call failed - stop polling and handle failure
          clearInterval(callStatusPollingInterval);
          callStatusPollingInterval = null;
          
          handleCallFailure(statusData);
          
        } else if (statusData.status === "completed") {
          // Call completed successfully - stop status polling
          clearInterval(callStatusPollingInterval);
          callStatusPollingInterval = null;
          
          console.log("Call completed successfully, waiting for transcript...");
          
          // Start auto-detection for conversation end
          startAutoDetectConversationEnd();
          
        } else if (pollAttempts >= maxAttempts) {
          // Timeout - stop polling
          clearInterval(callStatusPollingInterval);
          callStatusPollingInterval = null;
          
          console.warn("Call status polling timed out");
          handleCallTimeout();
        }
        
      } catch (error) {
        console.error("Error checking call status:", error);
        
        if (pollAttempts >= maxAttempts) {
          clearInterval(callStatusPollingInterval);
          callStatusPollingInterval = null;
        }
      }
    }

    // Start polling immediately, then every 2 seconds
    checkCallStatus();
    callStatusPollingInterval = setInterval(checkCallStatus, 2000);
  }

  // NEW FUNCTION: Handle call failure
  function handleCallFailure(statusData) {
    const nameForMsg = lastCustomerName || "User";
    
    // Stop all timers
    if (callDurationInterval) {
      clearInterval(callDurationInterval);
      callDurationInterval = null;
    }
    
    if (autoEndPollingInterval) {
      clearInterval(autoEndPollingInterval);
      autoEndPollingInterval = null;
    }
    
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    
    // Close modal
    modal.classList.remove("active");
    
    // Reset call state
    if (ws) ws.close();
    callSid = null;
    callStartTime = null;
    if (callDurationEl) callDurationEl.textContent = "0:00";
    
    // Determine failure message
    let failureMessage = "Call failed";
    const reason = statusData.failure_reason;
    
    if (reason === "busy") {
      failureMessage = `${nameForMsg}'s phone is busy. Please try again later.`;
    } else if (reason === "no-answer" || reason === "no_answer") {
      failureMessage = `${nameForMsg} did not answer the call.`;
    } else if (reason === "unavailable") {
      failureMessage = `${nameForMsg}'s phone is not reachable.`;
    } else if (reason === "api_error") {
      failureMessage = `Unable to initiate call. Please check the configuration.`;
    } else {
      failureMessage = `Unable to connect to ${nameForMsg}. Reason: ${reason}`;
    }
    
    console.log("Call failure:", failureMessage);
    
    // Show error message
    showToast(failureMessage);
    
    // Show form again after brief delay
    setTimeout(() => {
      chatDashboard.style.display = "none";
      document.querySelector(".form-section").style.display = "block";
    }, 1500);
  }

  // NEW FUNCTION: Handle call timeout
  function handleCallTimeout() {
    const nameForMsg = lastCustomerName || "User";
    
    // Stop all timers
    if (callDurationInterval) {
      clearInterval(callDurationInterval);
      callDurationInterval = null;
    }
    
    if (autoEndPollingInterval) {
      clearInterval(autoEndPollingInterval);
      autoEndPollingInterval = null;
    }
    
    // Close modal
    modal.classList.remove("active");
    
    // Show timeout message
    showToast(`Call connection timed out. Please try again.`);
    
    // Reset to form
    setTimeout(() => {
      chatDashboard.style.display = "none";
      document.querySelector(".form-section").style.display = "block";
    }, 1500);
  }

  // Load conversation by ID from backend API and render into chat
  async function loadConversation(conversationId) {
    try {
      console.log(`Loading conversation: ${conversationId}`);
      
      modal.classList.remove("active");
      chatDashboard.style.display = "flex";
      document.querySelector(".form-section").style.display = "none";

      chatMessages.innerHTML = "";
      fetchAndRenderSummary(conversationId);
      
      const data = await fetchJson(`${API_BASE_URL}/api/conversations/${conversationId}/messages?t=${Date.now()}`);

      console.log("Conversation data received:", data);

      const transcript = Array.isArray(data?.messages) ? data.messages : [];
      if (!transcript.length) {
        addMessage("Transcript not available yet.", "receiver");
        return;
      }

      updateAccountInfoFromMessages(transcript);
      
      transcript.forEach((msg, index) => {
        if (!msg || typeof msg.message !== "string") return;
        const role = (msg.role || "").toLowerCase();
        setTimeout(() => {
          addMessage(
            msg.message,
            role === "agent" ? "receiver" : "sender"
          );
        }, (index + 1) * 500);
      });
    } catch (err) {
      console.error("Error loading conversation messages by ID:", err);
      addMessage("Could not load conversation messages.", "receiver");
    }
  }

  // Show custom toast
  function showToast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 3000);
  }

  // Fetch and render call summary
  async function fetchAndRenderSummary(conversationId) {
    try {
      const el = document.getElementById('account-balance-value');
      if (!el || !conversationId) return;
      el.textContent = 'Loading summary...';

      const data = await fetchJson(`${API_BASE_URL}/api/conversations/${conversationId}/summary?t=${Date.now()}`);

      const summary = (data && typeof data.summary === 'string') ? data.summary.trim() : '';
      el.textContent = summary || 'Summary not available yet.';
    } catch (e) {
      const el = document.getElementById('account-balance-value');
      if (el) el.textContent = 'Could not load summary.';
      console.error('Summary fetch error:', e);
    }
  }

  // Extract account info from messages
  function updateAccountInfoFromMessages(messages) {
    try {
      const accEl = document.getElementById('account-number-value');
      const balEl = document.getElementById('account-balance-value');
      if (!messages || !messages.length) return;

      let accountNumber = null;
      let balance = null;

      const accRegex = /(?:account\s*number\s*[:\-]?\s*)([\dXx\- ]{8,})/i;
      const pan16 = /\b(\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4})\b/;
      const pan12 = /\b(\d{4}[- ]?\d{4}[- ]?\d{4})\b/;
      const balRegex = /(?:balance|bal)\s*[:\-]?\s*(?:₹|rs\.?|inr\s*)?([\d,]+(?:\.\d{1,2})?)/i;

      for (const m of messages) {
        const text = (m.message || '').toString();
        if (!accountNumber) {
          const m1 = text.match(accRegex) || text.match(pan16) || text.match(pan12);
          if (m1 && m1[1]) accountNumber = m1[1].replace(/\s+/g, '');
        }
        if (!balance) {
          const b1 = text.match(balRegex);
          if (b1 && b1[1]) balance = `₹${b1[1]}`;
        }
        if (accountNumber && balance) break;
      }

      if (accEl && accountNumber) accEl.textContent = accountNumber;
      if (balEl && balance) balEl.textContent = balance;
    } catch (e) {
      console.warn('Could not parse account info from transcript:', e);
    }
  }

  // UPDATED: Common handler when a call ends (manual or auto-detected)
  function onCallEnded(trigger = "user") {
    const nameForMsg = lastCustomerName || "User";
    
    modal.classList.remove("active");
    chatDashboard.style.display = "flex";
    document.querySelector(".form-section").style.display = "none";

    if (ws) ws.close();
    callSid = null;

    if (callDurationInterval) {
      clearInterval(callDurationInterval);
      callDurationInterval = null;
    }
    if (callDurationEl) callDurationEl.textContent = "0:00";

    // UPDATED: Also stop call status polling
    if (callStatusPollingInterval) {
      clearInterval(callStatusPollingInterval);
      callStatusPollingInterval = null;
    }

    if (autoEndPollingInterval) {
      clearInterval(autoEndPollingInterval);
      autoEndPollingInterval = null;
    }

    addMessage(trigger === "auto" ? "Call ended." : `${nameForMsg} cut the call.`, "sender");
    showToast(trigger === "auto" ? "Call ended" : `${nameForMsg} cut the call`);

    pollForConversation();
  }

  function startAutoDetectConversationEnd() {
    if (autoEndPollingInterval) clearInterval(autoEndPollingInterval);
    const startedAtMs = callStartTime ? callStartTime.getTime() : 0;

    async function checkEnd() {
      try {
        console.log("Auto-detecting conversation end...");
        const json = await fetchJson(`${API_BASE_URL}/api/conversations?t=${Date.now()}`);
        const items = json.conversations || [];

        const eligible = items.filter((c) => {
          if (!c || !c.timestamp) return false;
          const ts = Date.parse(c.timestamp);
          return !Number.isNaN(ts) && ts >= startedAtMs;
        });
        eligible.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

        const chosen = eligible[0];

        if (chosen && chosen.conversation_id && chosen.conversation_id !== lastConversationId) {
          console.log("Conversation detected:", chosen);
          lastConversationId = chosen.conversation_id;
          clearInterval(autoEndPollingInterval);
          autoEndPollingInterval = null;
          
          modal.classList.remove("active");
          chatDashboard.style.display = "flex";
          document.querySelector(".form-section").style.display = "none";
          
          setTimeout(() => {
            loadConversation(lastConversationId);
          }, 500);
        }
      } catch (e) {
        console.error("Auto-detection error:", e);
      }
    }

    checkEnd();
    autoEndPollingInterval = setInterval(checkEnd, 2000);
  }

  // Poll for conversation after call ends
  function pollForConversation() {
    if (pollingInterval) clearInterval(pollingInterval);
    const startedAtMs = callStartTime ? callStartTime.getTime() : 0;

    async function check() {
      try {
        console.log("Polling for conversation...");
        const json = await fetchJson(`${API_BASE_URL}/api/conversations?t=${Date.now()}`);
        const items = (json && Array.isArray(json.conversations)) ? json.conversations : [];

        console.log("Available conversations:", items);

        const eligible = items.filter((c) => {
          if (!c || !c.timestamp) return false;
          const ts = Date.parse(c.timestamp);
          return !Number.isNaN(ts) && ts >= startedAtMs;
        }).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

        const chosen = eligible[0];

        console.log("Chosen conversation:", chosen);

        if (chosen && chosen.conversation_id && chosen.conversation_id !== lastConversationId) {
          lastConversationId = chosen.conversation_id;
          clearInterval(pollingInterval);
          pollingInterval = null;
          
          modal.classList.remove("active");
          chatDashboard.style.display = "flex";
          document.querySelector(".form-section").style.display = "none";
          
          loadConversation(lastConversationId);
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    }

    check();
    pollingInterval = setInterval(check, 2000);
  }

  // Disconnect call
  disconnectCallBtn.addEventListener("click", function () {
    modal.classList.remove("active");
    onCallEnded("manual");
  });

  // New call
  newCallBtn.addEventListener("click", function () {
    chatDashboard.style.display = "none";
    document.querySelector(".form-section").style.display = "block";
    chatMessages.innerHTML = "";
    if (ws) ws.close();
    callSid = null;

    if (callDurationInterval) {
      clearInterval(callDurationInterval);
      callDurationInterval = null;
    }
    if (callDurationEl) callDurationEl.textContent = "0:00";

    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    
    if (callStatusPollingInterval) {
      clearInterval(callStatusPollingInterval);
      callStatusPollingInterval = null;
    }
    
    lastConversationId = null;
    lastCustomerName = null;
    currentConversationId = null;

    document.getElementById("name").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("country-code").value = "+91";
    document.getElementById("agent").value = "";
    document.getElementById("language").value = "";
    mobileValidation.textContent = "";
    mobileValidation.className = "mobile-validation";
    document.getElementById("mobile").placeholder = "Enter 10-digit mobile number";
    document.getElementById("mobile").maxLength = 10;
    
    const chatAgentName = document.getElementById("chat-agent-name");
    const chatStatus = document.getElementById("chat-status");
    if (chatAgentName) chatAgentName.textContent = "AI Assistant";
    if (chatStatus) chatStatus.textContent = "Online - Ready to help";
    
    updateFormFields();
    updateStartButton();
  });

  // Start WebSocket for real-time transcript
  function startWebSocket() {
    console.log("WebSocket connection would be established here");
  }

  // Add message to chat
  function addMessage(text, sender) {
    const messageEl = document.createElement("div");
    messageEl.classList.add("message");
    if (sender) messageEl.classList.add(sender);

    const iconClass = sender === "sender" ? "fa-user-tie" : "fa-headset";
    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    messageEl.innerHTML = `
      <div class="message-icon">
        <i class="fas ${iconClass}"></i>
      </div>
      <div class="message-bubble">
        <div class="message-content">${text}</div>
        <div class="message-time">${time}</div>
      </div>
    `;

    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});