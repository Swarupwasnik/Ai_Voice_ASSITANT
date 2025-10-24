import React, { useEffect } from 'react';

const Toast = ({ show, message, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div id="toast" className="toast show">
      {message}
    </div>
  );
};

export default Toast;