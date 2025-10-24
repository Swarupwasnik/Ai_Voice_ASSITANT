import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPhoneAlt, 
  faRobot, 
  faUser, 
  faPhoneSlash 
} from '@fortawesome/free-solid-svg-icons';
import "../styles/modal.css";

const ConnectingModal = ({ isOpen, onClose, formData }) => {
  if (!isOpen) return null;

  const agentDisplayName = formData?.agent ? 
    formData.agent.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    'AI Assistant';

  const languageDisplayName = formData?.language ? 
    formData.language.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
    '';

  return (
    <div className="modal active" id="connecting-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>
            <FontAwesomeIcon icon={faPhoneAlt} /> 
            Connecting AI Assistant to Customer
          </h2>
        </div> 
        <div className="modal-body">
          <p id="modal-connection-text">
            {agentDisplayName} {languageDisplayName && `(${languageDisplayName})`} connecting to {formData?.name}...
          </p>
          <div className="connection-animation">
            <div className="caller_icon">
              <FontAwesomeIcon icon={faRobot} />
            </div>
            <div className="connection-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <div className="receiver_icon">
              <FontAwesomeIcon icon={faUser} className="icon-user" />
            </div>
          </div>
          <div className="status-text">Please hold while we connect you...</div>
        </div>
        <div className="modal-footer">
          <button className="btn-disconnect" id="disconnect-call" onClick={onClose}>
            <FontAwesomeIcon icon={faPhoneSlash} /> End Call
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectingModal;

// import React from 'react';
// import "../styles/model.css"
// const ConnectingModal = ({ isOpen, onClose, formData }) => {
//   if (!isOpen) return null;

//   const agentDisplayName = formData?.agent ? 
//     formData.agent.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
//     'AI Assistant';

//   const languageDisplayName = formData?.language ? 
//     formData.language.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 
//     '';

//   return (
//     <div className="modal active" id="connecting-modal">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h2><i className="fas fa-phone-alt"></i> Connecting AI Assistant to Customer</h2>
//         </div> 
//         <div className="modal-body">
//           <p id="modal-connection-text">
//             {agentDisplayName} {languageDisplayName && `(${languageDisplayName})`} connecting to {formData?.name}...
//           </p>
//           <div className="connection-animation">
//             <div className="caller_icon">
//               <i className="fas fa-robot"></i>
//             </div>
//             <div className="connection-dots">
//               <div className="dot"></div>
//               <div className="dot"></div>
//               <div className="dot"></div>
//               <div className="dot"></div>
//               <div className="dot"></div>
//             </div>
//             <div className="receiver_icon">
//               <i className="fas fa-user icon-user"></i>
//             </div>
//           </div>
//           <div className="status-text">Please hold while we connect you...</div>
//         </div>
//         <div className="modal-footer">
//           <button className="btn-disconnect" id="disconnect-call" onClick={onClose}>
//             <i className="fas fa-phone-slash"></i> End Call
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConnectingModal;