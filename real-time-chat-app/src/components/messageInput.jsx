
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { currentUser } = useAuth();

  const handleSend = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      await addDoc(collection(db, 'messages'), {
        text: message,
        user: currentUser.email,
        createdAt: new Date(),
      });
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSend} className="message-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
        required
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;
