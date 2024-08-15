import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import Chat from "../assets/animations/chat.json";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up real-time listener for users
    const unsubscribeUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const usersData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.id !== currentUser?.uid); // Filter out the logged-in user

      setUsers(usersData);
        console.log(users)
      // Fetch messages for each user
      const fetchMessagesForUsers = async () => {
        const messagesData = {};
        for (const user of usersData) {
          const chatsQuery = query(
            collection(db, "chats"),
            where("participants", "array-contains", user.id)
          );

          const chatSnapshot = await getDocs(chatsQuery);
          const userMessages = [];

          for (const chatDoc of chatSnapshot.docs) {
            const chatId = chatDoc.id;
            const messagesQuery = query(
              collection(db, `chats/${chatId}/messages`),
              orderBy("timestamp", "desc"),
              limit(5)
            );
            const messagesSnapshot = await getDocs(messagesQuery);
            userMessages.push(
              ...messagesSnapshot.docs.map((doc) => ({
                ...doc.data(),
                chatId,
              }))
            );
          }

          messagesData[user.id] = userMessages;
        }
        setMessages(messagesData);
      };

      fetchMessagesForUsers();
    });

    return () => unsubscribeUsers(); // Cleanup listener on component unmount
  }, [currentUser?.uid]);

  const startPrivateChat = async (user1, user2) => {
    try {
      const chatQuery = query(
        collection(db, "chats"),
        where("participants", "array-contains", user1.uid)
      );

      const chatSnapshot = await getDocs(chatQuery);
      let chatId = "";

      chatSnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.participants.includes(user2.uid)) {
          chatId = doc.id;
        }
      });

      if (!chatId) {
        const chatRef = await addDoc(collection(db, "chats"), {
          participants: [user1.uid, user2.uid],
        });
        chatId = chatRef.id;
      }

      navigate(`/chat/${chatId}`);
      setIsUserListVisible(false);
    } catch (error) {
      console.error("Error starting private chat:", error);
      // Display an error message to the user or log the error in a more robust way
    }
  };

  const toggleUserList = () => {
    setIsUserListVisible(!isUserListVisible);
  };

  const filteredUsers = users
    .filter((user) =>
      user.userName ? user.userName.toLowerCase().includes(searchTerm.toLowerCase()) : false
    )
    .sort((a, b) => {
      const aNewMessages = messages[a.id]?.some(
        (msg) => msg.senderId !== currentUser.uid && msg.read === false
      );
      const bNewMessages = messages[b.id]?.some(
        (msg) => msg.senderId !== currentUser.uid && msg.read === false
      );
      return aNewMessages === bNewMessages ? 0 : aNewMessages ? -1 : 1;
    });

  return (
    <>
      <div className="user-list-toggle">
        <input type="checkbox" id="checkbox" onChange={toggleUserList} />
        <label htmlFor="checkbox" className="toggle">
          <div className="bar bar--top"></div>
          <div className="bar bar--middle"></div>
          <div className="bar bar--bottom"></div>
        </label>
      </div>
      <div className={`user-list ${isUserListVisible ? "visible" : "hidden"}`}>
        <h2>Users</h2>
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {filteredUsers.length === 0 ? (
            <li>User not found</li>
          ) : (
            filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => startPrivateChat(currentUser, user)}
              >
                <img
                  src={user.profilePicture}
                  alt={`${user.userName}'s profile`}
                />
                <span>{user.userName}</span>
                {messages[user.id]?.some(
                  (msg) =>
                    msg.senderId !== currentUser.uid && msg.read === false
                ) && <span className="new-message-indicator">New</span>}
                <ul>
                  {messages[user.id] &&
                    messages[user.id].map((message, index) => (
                      <li key={index}>{message.content}</li>
                    ))}
                </ul>
                <Lottie
                  animationData={Chat}
                  loop={true}
                  autoplay={true}
                  style={{ width: 24, height: 24 }}
                />
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="user-list desk">
        <h2>Users</h2>
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul>
          {filteredUsers.length === 0 ? (
            <li>User not found</li>
          ) : (
            filteredUsers.map((user) => (
              <li
                key={user.id}
                onClick={() => startPrivateChat(currentUser, user)}
              >
                <img
                  src={user.profilePicture}
                  alt={`${user.userName}'s profile`}
                />
                <span>{user.userName}</span>
                <Lottie
                  animationData={Chat}
                  loop={true}
                  autoplay={true}
                  style={{ width: 24, height: 24 }}
                />
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default UserList;
