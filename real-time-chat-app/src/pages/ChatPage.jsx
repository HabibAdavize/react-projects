import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/navbar";
import Message from "../components/message";
import MessageInput from "../components/messageInput";
import UserList from "../components/UserList";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { chatId } = useParams(); // Get chatId from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && chatId) {
        try {
          const messagesQuery = query(
            collection(db, `chats/${chatId}/messages`),
            orderBy("timestamp", "asc")
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
          setMessages(messagesData);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [chatId, currentUser]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && chatId) {
      try {
        await addDoc(collection(db, `chats/${chatId}/messages`), {
          senderId: currentUser.uid,
          content: newMessage,
          timestamp: serverTimestamp(),
        });
        setNewMessage("");
        setMessages((prevMessages) => [...prevMessages, { senderId: currentUser.uid, content: newMessage }]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="chat-container">
      <Navbar />
      <div className="chat-content">
        <UserList onSelectUser={(chatId) => {}} /> {/* Optional: handle UI changes on user selection */}
        <div className="message-input">
          <ul>
            {messages.map((message) => (
              <li key={message.timestamp} className={`message ${message.senderId === currentUser.uid ? "sent" : "received"}`}>
                {message.content}
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
