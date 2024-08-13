import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
  doc,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/navbar";
import UserList from "../components/UserList";
import Preloader from "../components/Preloader";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { chatId } = useParams(); // Get chatId from URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUser, setChatUser] = useState(null); // State to store the user data
  const { currentUser } = useAuth();
  const [loadingMessages, setLoadingMessages] = useState(false); // State to handle loading messages
  const [conversationStartDate, setConversationStartDate] = useState(null); // State to store conversation start date
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  ); // State for theme

  useEffect(() => {
    document.body.dataset.theme = isDarkMode ? "dark" : "light";
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentUser && chatId) {
        setLoadingMessages(true); // Set loading to true before fetching data

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
            setMessages(messagesData); // Reverse the order to show newer messages first

            if (messagesData.length > 0) {
              setConversationStartDate(
                messagesData[messagesData.length - 1].timestamp
              ); // Get the timestamp of the first message
            }

            setLoadingMessages(false); // Set loading to false when data is fetched
          });

          // Fetch the other user's data
          const fetchChatUser = async () => {
            const chatDoc = await getDoc(doc(db, "chats", chatId));
            const participants = chatDoc.data()?.participants || [];
            const otherUserId = participants.find(
              (id) => id !== currentUser.uid
            );

            if (otherUserId) {
              const userDoc = await getDoc(doc(db, "users", otherUserId));
              setChatUser(userDoc.data());
            }
          };

          await fetchChatUser();

          return () => unsubscribe();
        } catch (error) {
          console.error("Error fetching messages:", error);
          setLoadingMessages(false); // Ensure loading is turned off on error
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
      <Navbar onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <div className="chat-content">
        <UserList onSelectUser={() => setLoadingMessages(true)} />{" "}
        {/* Set loading to true on user selection */}
        <div className="chat-box">
          {loadingMessages ? (
            <>
              <div class="banter-loader">
                <div class="banter-loader__box"></div>
                <div class="banter-loader__box"></div>
                <div class="banter-loader__box"></div>
                <div class="banter-loader__box"></div>
                <div class="banter-loader__box"></div>
                <div class="banter-loader__box"></div>
                <div class="banter-loader__box"></div>
                <div class="banter-loader__box"></div>
                <div class="banter-loader__box"></div>
              </div>
            </>
          ) : (
            <>
              {/* Profile Section */}
              {chatUser && (
                <div className="profile-header">
                  <img
                    src={chatUser.profilePicture}
                    alt="Profile"
                    className="profile-picture-large"
                  />
                  <span className="profile-name">{chatUser.userName}</span>
                </div>
              )}

              {conversationStartDate && (
                <div className="conversation-start-date">
                  Conversation started on{" "}
                  {new Date(
                    conversationStartDate.toDate()
                  ).toLocaleDateString()}
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
                      <span className="timestamp">
                        {new Date(
                          message.timestamp?.toDate()
                        ).toLocaleTimeString()}
                      </span>
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
                <button onClick={handleSendMessage}>
                  <div class="svg-wrapper-1">
                    <div class="svg-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path
                          fill="currentColor"
                          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <span>Send</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
