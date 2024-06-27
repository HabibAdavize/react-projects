// src/pages/ChatPage.js
import React, { useEffect, useState } from 'react';
import { db, collection, query, orderBy, onSnapshot } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/navbar';
import Message from '../components/message';
import MessageInput from '../components/messageInput';
import UserList from '../components/UserList';

const ChatPage = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        isCurrentUser: doc.data().user === currentUser.email,
      }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="chat-container">
      <Navbar />
      <div className="chat-content">
        <UserList onSelectUser={setSelectedUser} />
        <div className="chat-box">
          <div className="messages">
            {messages.map((msg) => (
              <Message key={msg.id} message={msg} />
            ))}
          </div>
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
