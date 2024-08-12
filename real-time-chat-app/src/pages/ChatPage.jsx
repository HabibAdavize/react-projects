import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/navbar";
import UserList from "../components/UserList";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { chatId } = useParams(); // Get chatId from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUser, setChatUser] = useState(null); // State to store the user data
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && chatId) {
        try {
          const messagesQuery = query(
            collection(db, `chats/${chatId}/messages`),
            orderBy("timestamp", "asc")
          );
          const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
            const messagesData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMessages(messagesData);
          });

          // Fetch the other user's data
          const fetchChatUser = async () => {
            const chatDoc = await getDoc(doc(db, "chats", chatId));
            const participants = chatDoc.data()?.participants || [];
            const otherUserId = participants.find(id => id !== currentUser.uid);
            
            if (otherUserId) {
              const userDoc = await getDoc(doc(db, "users", otherUserId));
              setChatUser(userDoc.data());
            }
          };

          fetchChatUser();

          return () => unsubscribe();
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
          senderName: currentUser.displayName, // Assuming displayName is available
          senderProfilePicture: currentUser.photoURL, // Assuming photoURL is available
          content: newMessage,
          timestamp: serverTimestamp(),
        });
        setNewMessage("");
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
        <div className="chat-box">
          {/* Profile Section */}
          {chatUser && (
            <div className="profile-header">
              <img src={chatUser.profilePicture} alt="Profile" className="profile-picture-large" />
              <span className="profile-name">{chatUser.userName}</span>
            </div>
          )}

          <ul className="messages">
            {messages.map((message) => (
              <li
                key={message.id}
                className={`message ${
                  message.senderId === currentUser.uid ? "current-user" : ""
                }`}
              >
                <div className="message-header">
                  <span className="sender-name">{message.senderName}</span>
                  <span className="timestamp">{new Date(message.timestamp?.toDate()).toLocaleTimeString()}</span>
                </div>
                <div className="message-content">{message.content}</div>
              </li>
            ))}
          </ul>
          <div className="message-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              required
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
