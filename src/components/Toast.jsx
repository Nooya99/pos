import React, { useEffect } from 'react';

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type} show`}>
      <i
        className={`fa-solid ${
          type === 'success'
            ? 'fa-circle-check text-success'
            : type === 'danger'
            ? 'fa-circle-xmark text-danger'
            : 'fa-circle-info'
        }`}
      ></i>
      <span>{message}</span>
    </div>
  );
}
