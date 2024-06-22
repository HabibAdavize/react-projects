
import React from 'react';

const Message = ({ message }) => {
  return (
    <div className={`message ${message.isCurrentUser ? 'current-user' : ''}`}>
      <span>{message.user}</span>
      <p>{message.text}</p>
    </div>
  );
};

export default Message;
