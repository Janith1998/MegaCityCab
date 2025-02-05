import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimesCircle } from "react-icons/fa";
import './Message.css'; // Import styles

const Message = ({ type, message, onClose }) => {
  // Automatically close the message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose(); // Close message after 3 seconds
      }, 3000);

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [message, onClose]);

  const getMessageStyle = () => {
    switch (type) {
      case "success":
        return "message-success";
      case "error":
        return "message-error";
      case "info":
        return "message-info";
      default:
        return "";
    }
  };

  return (
    message && (
      <div className={`message ${getMessageStyle()}`}>
        {type === "success" && <FaCheckCircle />}
        {type === "error" && <FaExclamationCircle />}
        {type === "info" && <FaTimesCircle />}
        <span>{message}</span>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
    )
  );
};

export default Message;
