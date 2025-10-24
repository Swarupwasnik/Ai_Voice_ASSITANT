import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const [isModalOpen, setIsModalOpen] = useState(false); // No modal needed
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
  const API_BASE_URL = "https://virtualvaani.vgipl.com:8000";

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
          // Show waiting message if no conversations found yet
          if (messages.length <= 1) { // Only initial message
            addMessage('Waiting for conversation to start...', 'receiver');
          }
        }
        
        if (latest && latest.conversation_id && latest.conversation_id !== lastConversationId) {
          console.log('Found new conversation:', latest.conversation_id);
          setLastConversationId(latest.conversation_id);
          
          // Load messages in real-time during call
          const data = await fetchJson(`${API_BASE_URL}/api/conversations/${latest.conversation_id}/messages?t=${Date.now()}`);
          const transcript = Array.isArray(data?.messages) ? data.messages : [];
          
          // Clear and reload messages
          setMessages([]);
          displayedMessageIds.current.clear();
          
          transcript.forEach((msg, index) => {
            if (msg && typeof msg.message === "string") {
              const role = (msg.role || "").toLowerCase();
              const messageId = `${latest.conversation_id}-${index}`;
              addMessage(
                msg.message,
                role === "agent" ? "receiver" : "sender",
                messageId
              );
            }
          });
          
          // Load summary in real-time
          fetchAndRenderSummary(latest.conversation_id);
        }
      } catch (e) {
        console.error("Real-time polling error:", e);
      }
    };

    realTimePollingRef.current = setInterval(checkMessages, 5000);
  };

  // Monitor call status to auto-close modal when call ends
  const monitorCallStatus = () => {
    if (callStatusPollingRef.current) {
      clearInterval(callStatusPollingRef.current);
    }

    const checkCallStatus = async () => {
      try {
        // Check if call is still active by looking for new messages
        let json, items;
        try {
          json = await fetchJson(`${API_BASE_URL}/api/conversations?t=${Date.now()}`);
          items = json.conversations || [];
        } catch (fetchError) {
          console.warn('API unavailable for status check');
          return;
        }
        
        if (items.length > 0 && lastConversationId) {
          const currentConv = items.find(c => c.conversation_id === lastConversationId);
          if (currentConv) {
            // Check if conversation has ended (no new messages for 30 seconds)
            const lastUpdate = Date.parse(currentConv.timestamp);
            const timeSinceUpdate = Date.now() - lastUpdate;
            
            if (timeSinceUpdate > 30000) { // 30 seconds without update
              // Call likely ended
              handleCallEnd();
            }
          }
        }
      } catch (e) {
        console.error("Call status monitoring error:", e);
      }
    };

    callStatusPollingRef.current = setInterval(checkCallStatus, 10000); // Check every 10 seconds
  };

  // Handle call end
  const handleCallEnd = () => {
    callEndTimeRef.current = new Date();
    setIsCallOngoing(false);
    
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
    
    // Add call end message
    const nameForMsg = lastCustomerName || "User";
    addMessage(`${nameForMsg} cut the call.`, "sender");
    
    // Load final conversation immediately
    if (lastConversationId) {
      loadConversation(lastConversationId);
    }
  };

  // No modal needed

  // Load conversation by ID from backend API
  const loadConversation = async (conversationId) => {
    try {
      console.log(`Loading conversation: ${conversationId}`);
      
      // Clear existing messages
      setMessages([]);
      
      // Only handle real API conversations
      
      // Fetch and render summary
      await fetchAndRenderSummary(conversationId);
      
      // Use the messages endpoint that returns { status, conversation_id, messages: [{role, message}] }
      const data = await fetchJson(`${API_BASE_URL}/api/conversations/${conversationId}/messages?t=${Date.now()}`);

      console.log("Conversation data received:", data);

      const transcript = Array.isArray(data?.messages) ? data.messages : [];
      if (!transcript.length) {
        const nameForMsg = lastCustomerName || "User";
        addMessage(`${nameForMsg} did not receive the call.`, "receiver");
        return;
      }

      // Try to populate sidebar account info from transcript
      updateAccountInfoFromMessages(transcript);

      // Display messages with a slight delay for better UX
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
      
      // Don't add call end message here - it's handled by handleCallEnd
    } catch (err) {
      console.error("Error loading conversation messages by ID:", err);
      addMessage("Could not load conversation messages.", "receiver");
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

    // Add initial connection message
    setTimeout(() => {
      addMessage(`Call initiated to ${formData.name}. Please wait...`, "receiver");
    }, 500);
    
    // Wait for real API conversation only
    
    // Start conversation ID detection after initial delay
    setTimeout(() => {
      pollRealTimeMessages();
      monitorCallStatus();
    }, 2000);

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
      <div className="chat-dashboard" id="chat-dashboard" style={{ display: 'flex' }}>
        <div className="chat-header">
          <img
            src="https://ui-avatars.com/api/?name=AI+Assistant&background=667eea&color=fff"
            alt="AI Assistant"
          />
          <div className="chat-header-info">
            <h3 id="chat-agent-name">{agentDisplayName} {languageDisplayName && `(${languageDisplayName})`}</h3>
            <p id="chat-status">
              {isCallOngoing ? (
                <span>
                  <span className="status-live">🔴 LIVE</span> Connected to {formData.name} | Duration: {callDuration}
                </span>
              ) : (
                `Call ended with ${formData.name}`
              )}
            </p>
          </div>
        </div>

        <div className="chat-content">
          <div className="chat-messages" id="chat-messages" ref={chatMessagesRef}>
            {messages.map(message => (
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
          {isCallOngoing ? (
            <button className="btn-disconnect" onClick={handleCallEnd}>
              <i className="fas fa-phone-slash"></i> End Call
            </button>
          ) : (
            <button className="btn-new-call" id="new-call" onClick={handleNewCall}>
              <i className="fas fa-phone"></i> New Call
            </button>
          )}
        </div>
      </div>


    </div>
  );
};

export default ChatDashboard;