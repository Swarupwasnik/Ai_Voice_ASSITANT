import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConnectingModal from '../components/ConnectingModal';
import '../styles/modal.css';
import '../styles/modal-status.css';
import '../styles/live-status.css';
import '../styles/chatDashboard.css';

const ChatDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    formData, 
    callSid, 
    callStartTime, 
    lastCustomerName 
  } = location.state || {};
  
  const [messages, setMessages] = useState([]);
  const [callSummary, setCallSummary] = useState('—');
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [callDuration, setCallDuration] = useState('0:00');
  const [lastConversationId, setLastConversationId] = useState(null);
  const [isCallOngoing, setIsCallOngoing] = useState(true);
  const [isConnectingModalOpen, setIsConnectingModalOpen] = useState(true); // ConnectingModal open during call
  const [realTimeMessages, setRealTimeMessages] = useState([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [userSessionKey] = useState(() => `user_${formData?.mobile || Date.now()}_${callSid || Math.random()}`);
  
  const chatMessagesRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const callDurationIntervalRef = useRef(null);
  const realTimePollingRef = useRef(null);
  const displayedMessageIds = useRef(new Set());
  const callEndTimeRef = useRef(null);
  const callStatusPollingRef = useRef(null);

  // API Configuration
  const API_BASE_URL = "https://harold-unsalivated-loralee.ngrok-free.dev";

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

  // Update call duration
  const updateCallDuration = () => {
    if (!callStartTime) return;
    const now = new Date();
    const diff = Math.floor((now - new Date(callStartTime)) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    setCallDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  };

  // Add message to chat
  const addMessage = (text, sender, messageId = null) => {
    const id = messageId || Date.now() + Math.random();
    
    // Prevent duplicate messages
    if (messageId && displayedMessageIds.current.has(messageId)) {
      return;
    }
    
    if (messageId) {
      displayedMessageIds.current.add(messageId);
    }
    
    const newMessage = {
      id,
      text,
      sender,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  // Poll for real-time messages during ongoing call (just to detect conversation ID)
  const pollRealTimeMessages = () => {
    if (realTimePollingRef.current) {
      clearInterval(realTimePollingRef.current);
    }

    const startedAtMs = callStartTime ? new Date(callStartTime).getTime() : Date.now();

    const checkMessages = async () => {
      try {
        // Validate current session
        const currentSession = localStorage.getItem('currentCallSession');
        if (!currentSession) {
          console.warn('No active session found');
          return;
        }
        
        const sessionData = JSON.parse(currentSession);
        if (sessionData.userPhone !== formData?.mobile) {
          console.warn('Session phone mismatch');
          return;
        }
        
        // Skip demo mode - only use real API conversations

        let json, items;
        try {
          json = await fetchJson(`${API_BASE_URL}/api/conversations?t=${Date.now()}`);
          items = json.conversations || [];
        } catch (fetchError) {
          console.error('API unavailable:', fetchError.message);
          return;
        }
        
        console.log(`Found ${items.length} conversations, looking for conversations after:`, new Date(startedAtMs));
        
        // Filter conversations by this specific user session only
        const eligibleConversations = items.filter((c) => {
          if (!c || !c.timestamp) return false;
          const ts = Date.parse(c.timestamp);
          const timeDiff = Math.abs(ts - startedAtMs);
          
          console.log('Checking conversation:', c);
          
          // Only conversations within time window - remove phone matching since fields are undefined
          const isTimeMatch = !Number.isNaN(ts) && ts >= startedAtMs && timeDiff <= 600000;
          const isUserMatch = true; // Accept all conversations in time window for now
          
          console.log('Match result:', { isTimeMatch, isUserMatch, timeDiff });
          return isTimeMatch && isUserMatch;
        }).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
        
        console.log(`Found ${eligibleConversations.length} eligible conversations:`, eligibleConversations.map(c => ({ id: c.conversation_id, timestamp: c.timestamp })));
        
        const latest = eligibleConversations[0];
        
        if (eligibleConversations.length === 0) {
          console.log('No eligible conversations found for this user and time window');
          // Don't show any waiting messages
        }
        
        if (latest && latest.conversation_id && latest.conversation_id !== lastConversationId) {
          console.log('Found conversation during call:', latest.conversation_id);
          setLastConversationId(latest.conversation_id);
          // Don't load messages during call - only store conversation ID
        }
      } catch (e) {
        console.error("Real-time polling error:", e);
      }
    };

    realTimePollingRef.current = setInterval(checkMessages, 5000);
  };

  // Monitor for conversation and auto-end call when found
  const monitorCallStatus = () => {
    if (callStatusPollingRef.current) {
      clearInterval(callStatusPollingRef.current);
    }

    const startedAtMs = callStartTime ? new Date(callStartTime).getTime() : Date.now();

    const checkForConversation = async () => {
      try {
        let json, items;
        try {
          json = await fetchJson(`${API_BASE_URL}/api/conversations?t=${Date.now()}`);
          items = json.conversations || [];
        } catch (fetchError) {
          console.warn('API unavailable for conversation check');
          return;
        }
        
        // Look for conversations that match our call time
        const eligibleConversations = items.filter((c) => {
          if (!c || !c.timestamp) return false;
          const ts = Date.parse(c.timestamp);
          const timeDiff = Math.abs(ts - startedAtMs);
          return !Number.isNaN(ts) && ts >= startedAtMs && timeDiff <= 600000; // 10 minutes window
        }).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
        
        // If we found a conversation, the call has ended
        if (eligibleConversations.length > 0) {
          const conversation = eligibleConversations[0];
          console.log('Conversation detected - call ended automatically:', conversation.conversation_id);
          setLastConversationId(conversation.conversation_id);
          handleCallEnd();
        }
        
      } catch (e) {
        console.error("Conversation monitoring error:", e);
      }
    };

    callStatusPollingRef.current = setInterval(checkForConversation, 5000); // Check every 5 seconds
  };

  // Handle call end
  const handleCallEnd = () => {
    callEndTimeRef.current = new Date();
    setIsCallOngoing(false);
    setIsConnectingModalOpen(false); // Close ConnectingModal when call ends
    
    // Stop call duration timer
    if (callDurationIntervalRef.current) {
      clearInterval(callDurationIntervalRef.current);
      callDurationIntervalRef.current = null;
    }
    
    // Stop all polling
    if (realTimePollingRef.current) {
      clearInterval(realTimePollingRef.current);
      realTimePollingRef.current = null;
    }
    
    if (callStatusPollingRef.current) {
      clearInterval(callStatusPollingRef.current);
      callStatusPollingRef.current = null;
    }
    
    // Clear messages and load complete conversation
    setMessages([]);
    displayedMessageIds.current.clear();
    
    // Load complete conversation after call ends
    if (lastConversationId) {
      setTimeout(() => {
        loadCompleteConversation(lastConversationId);
      }, 1000);
    } else {
      // Try to find conversation one more time
      setTimeout(() => {
        findAndLoadConversation();
      }, 2000);
    }
  };

  // No modal needed

  // Load complete conversation after call ends
  const loadCompleteConversation = async (conversationId) => {
    try {
      console.log(`Loading complete conversation: ${conversationId}`);
      
      // Fetch and render summary
      await fetchAndRenderSummary(conversationId);
      
      // Use the messages endpoint
      const data = await fetchJson(`${API_BASE_URL}/api/conversations/${conversationId}/messages?t=${Date.now()}`);

      console.log("Complete conversation data received:", data);

      const transcript = Array.isArray(data?.messages) ? data.messages : [];
      if (!transcript.length) {
        addMessage("No conversation messages found.", "receiver");
        return;
      }

      // Display all messages immediately after call ends
      transcript.forEach((msg, index) => {
        if (!msg || typeof msg.message !== "string") return;
        const role = (msg.role || "").toLowerCase();
        const messageId = `${conversationId}-${index}`;
        addMessage(
          msg.message,
          role === "agent" ? "receiver" : "sender",
          messageId
        );
      });
      
    } catch (err) {
      console.error("Error loading complete conversation:", err);
      addMessage("Could not load conversation messages.", "receiver");
    }
  };
  
  // Find and load conversation when call ends
  const findAndLoadConversation = async () => {
    try {
      const startedAtMs = callStartTime ? new Date(callStartTime).getTime() : Date.now() - 600000;
      const json = await fetchJson(`${API_BASE_URL}/api/conversations?t=${Date.now()}`);
      const items = json.conversations || [];
      
      const eligible = items.filter((c) => {
        if (!c || !c.timestamp) return false;
        const ts = Date.parse(c.timestamp);
        return !Number.isNaN(ts) && ts >= startedAtMs;
      }).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
      
      const chosen = eligible[0];
      if (chosen && chosen.conversation_id) {
        setLastConversationId(chosen.conversation_id);
        loadCompleteConversation(chosen.conversation_id);
      } else {
        addMessage("No conversation found for this call.", "receiver");
      }
    } catch (err) {
      console.error("Error finding conversation:", err);
      addMessage("Could not find conversation.", "receiver");
    }
  };

  // Fetch and render call summary
  const fetchAndRenderSummary = async (conversationId) => {
    try {
      if (!conversationId) return;
      
      // Only handle real API summaries
      
      setCallSummary('Loading summary...');

      const data = await fetchJson(`${API_BASE_URL}/api/conversations/${conversationId}/summary?t=${Date.now()}`);

      const summary = (data && typeof data.summary === 'string') ? data.summary.trim() : '';
      setCallSummary(summary || 'Summary not available yet.');
    } catch (e) {
      setCallSummary('Summary not available - API error');
      console.error('Summary fetch error:', e);
    }
  };

  // Attempt to extract and populate account number/balance from messages
  const updateAccountInfoFromMessages = (messages) => {
    try {
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

      // You can set these to state if you have account number display
      console.log('Extracted account info:', { accountNumber, balance });
    } catch (e) {
      console.warn('Could not parse account info from transcript:', e);
    }
  };

  // Load conversation messages
  const loadConversation = async (conversationId) => {
    
    try {
      console.log(`Loading conversation: ${conversationId}`);
      
      const data = await fetchJson(`${API_BASE_URL}/api/conversations/${conversationId}/messages?t=${Date.now()}`);
      console.log("Conversation data received:", data);

      const transcript = Array.isArray(data?.messages) ? data.messages : [];
      if (!transcript.length) {
        console.log("No messages found in conversation");
        return;
      }

      // Clear existing messages and add new ones
      setMessages([]);
      displayedMessageIds.current.clear();
      
      // Display all messages
      transcript.forEach((msg, index) => {
        if (!msg || typeof msg.message !== "string") return;
        const role = (msg.role || "").toLowerCase();
        const messageId = `${conversationId}-${index}`;
        addMessage(
          msg.message,
          role === "agent" ? "receiver" : "sender",
          messageId
        );
      });
      
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  };

  // Poll for conversation (only for this specific call)
  const pollForConversation = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    // Use the already found conversation ID if available
    if (lastConversationId) {
      loadConversation(lastConversationId);
      return;
    }

    const startedAtMs = callStartTime ? new Date(callStartTime).getTime() : Date.now();

    const check = async () => {
      try {
        const json = await fetchJson(`${API_BASE_URL}/api/conversations?t=${Date.now()}`);
        const items = (json && Array.isArray(json.conversations)) ? json.conversations : [];

        // Find conversation for this specific call session (time-based only)
        const eligible = items.filter((c) => {
          if (!c || !c.timestamp) return false;
          const ts = Date.parse(c.timestamp);
          const isTimeMatch = !Number.isNaN(ts) && ts >= startedAtMs && ts <= (startedAtMs + 300000);
          
          return isTimeMatch;
        }).sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

        const chosen = eligible[0];

        if (chosen && chosen.conversation_id) {
          setLastConversationId(chosen.conversation_id);
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
          
          // Load conversation
          loadConversation(chosen.conversation_id);
        }
      } catch (e) {
        console.error("Polling error:", e);
      }
    };

    check();
    pollingIntervalRef.current = setInterval(check, 3000);
  };

  // Start auto-detection for conversation end
  const startAutoDetectConversationEnd = () => {
    const startedAtMs = callStartTime ? new Date(callStartTime).getTime() : Date.now();

    const checkEnd = async () => {
      try {
        console.log("Auto-detecting conversation end...");
        const json = await fetchJson(`${API_BASE_URL}/api/conversations?t=${Date.now()}`);
        const items = json.conversations || [];

        // Look for conversations in time window only
        const eligible = items.filter((c) => {
          if (!c || !c.timestamp) return false;
          const ts = Date.parse(c.timestamp);
          const isTimeMatch = !Number.isNaN(ts) && ts >= startedAtMs;
          
          return isTimeMatch;
        });
        eligible.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

        const chosen = eligible[0];

        if (chosen && chosen.conversation_id && chosen.conversation_id !== lastConversationId) {
          console.log("Conversation detected:", chosen);
          setLastConversationId(chosen.conversation_id);
          
          // Load conversation immediately
          setTimeout(() => {
            loadConversation(chosen.conversation_id);
          }, 500);
        }
      } catch (e) {
        console.error("Auto-detection error:", e);
      }
    };

    // Start checking immediately and more frequently
    checkEnd();
    const interval = setInterval(checkEnd, 2000);
    return interval;
  };

  const handleNewCall = () => {
    // Clean up intervals
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    if (callDurationIntervalRef.current) {
      clearInterval(callDurationIntervalRef.current);
    }
    
    navigate('/');
  };

  const toggleSummary = () => {
    setIsSummaryOpen(!isSummaryOpen);
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!formData) {
      navigate('/');
      return;
    }

    // Store user session in localStorage to prevent cross-user contamination
    const sessionData = {
      userPhone: formData.mobile,
      callStartTime: callStartTime,
      sessionId: userSessionKey,
      timestamp: Date.now()
    };
    localStorage.setItem('currentCallSession', JSON.stringify(sessionData));

    // Start call duration timer
    callDurationIntervalRef.current = setInterval(updateCallDuration, 1000);

    // Don't show any messages during call
    
    // Wait for real API conversation only
    
    // Start call monitoring after initial delay
    setTimeout(() => {
      monitorCallStatus();
    }, 2000);
    
    // Add manual call end button handler
    const handleManualCallEnd = () => {
      handleCallEnd();
    };
    
    // Store reference for cleanup
    window.handleManualCallEnd = handleManualCallEnd;

    // Clean up on unmount
    return () => {
      // Clear session data when component unmounts
      localStorage.removeItem('currentCallSession');
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (callDurationIntervalRef.current) {
        clearInterval(callDurationIntervalRef.current);
      }
      if (realTimePollingRef.current) {
        clearInterval(realTimePollingRef.current);
      }
      if (callStatusPollingRef.current) {
        clearInterval(callStatusPollingRef.current);
      }
    };
  }, [formData, navigate]);

  // Apply responsive state for call summary
  useEffect(() => {
    const applyResponsiveState = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      setIsSummaryOpen(!isMobile);
    };

    applyResponsiveState();
    window.addEventListener('resize', applyResponsiveState);

    return () => {
      window.removeEventListener('resize', applyResponsiveState);
    };
  }, []);

  if (!formData) {
    return null;
  }

  const agentDisplayName = formData.agent ? 
    formData.agent.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    'AI Assistant';

  const languageDisplayName = formData.language ? 
    formData.language.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    '';

  return (
    <div className="container">
      {/* ConnectingModal during call */}
      <ConnectingModal 
        isOpen={isConnectingModalOpen && isCallOngoing}
        onClose={handleCallEnd}
        formData={formData}
      />
      
      <div className="chat-dashboard" id="chat-dashboard" style={{ display: 'flex' }}>
        <div className="chat-header">
          <img
            src="https://ui-avatars.com/api/?name=AI+Assistant&background=667eea&color=fff"
            alt="AI Assistant"
          />
          <div className="chat-header-info">
            <h3 id="chat-agent-name">{agentDisplayName} {languageDisplayName && `(${languageDisplayName})`}</h3>
            <p id="chat-status">
              Connected to {formData.name}
            </p>
          </div>
        </div>

        <div className="chat-content">
          <div className="chat-messages" id="chat-messages" ref={chatMessagesRef}>
            {!isCallOngoing && messages.map(message => (
              <div key={message.id} className={`message ${message.sender}`}>
                <div className="message-icon">
                  <i className={`fas ${message.sender === 'sender' ? 'fa-user-tie' : 'fa-headset'}`}></i>
                </div>
                <div className="message-bubble">
                  <div className="message-content">{message.text}</div>
                  <div className="message-time">{message.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="chat-sidebar">
            <div className={`info-card collapsible ${isSummaryOpen ? 'open' : ''}`} id="call-summary-card">
              <button
                className="info-card-header"
                id="call-summary-toggle"
                aria-expanded={isSummaryOpen}
                onClick={toggleSummary}
              >
                <span><i className="fas fa-coins"></i> Call Summary</span>
                <i className={`fas fa-chevron-down chevron ${isSummaryOpen ? 'rotated' : ''}`}></i>
              </button>
              <div className="info-card-body" id="call-summary-body" 
                   style={{ 
                     maxHeight: isSummaryOpen ? '600px' : '0',
                     opacity: isSummaryOpen ? '1' : '0'
                   }}>
                <p id="account-balance-value">{callSummary}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="chat-footer">
          <button className="btn-new-call" id="new-call" onClick={handleNewCall}>
            <i className="fas fa-phone"></i> New Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDashboard;