import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndMessages = async () => {
      try {
        const usersCollection = await getDocs(collection(db, 'users'));
        const usersData = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);

        const messagesData = {};
        for (const user of usersData) {
          const messagesQuery = query(
            collection(db, 'messages'),
            where('senderId', '==', user.id),
            orderBy('timestamp', 'desc'),
            limit(5)
          );
          const messagesSnapshot = await getDocs(messagesQuery);
          messagesData[user.id] = messagesSnapshot.docs.map(doc => doc.data());
        }
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching users or messages:', error);
        // Display an error message to the user or log the error in a more robust way
      }
    };

    fetchUsersAndMessages();
  }, []);

  const startPrivateChat = async (user1, user2) => {
    try {
      const chatQuery = query(
        collection(db, 'chats'),
        where('participants', 'array-contains', user1.uid)
      );

      const chatSnapshot = await getDocs(chatQuery);
      let chatId = '';

      chatSnapshot.forEach(doc => {
        const data = doc.data();
        if (data.participants.includes(user2.uid)) {
          chatId = doc.id;
        }
      });

      if (!chatId) {
        const chatRef = await addDoc(collection(db, 'chats'), {
          participants: [user1.uid, user2.uid],
        });
        chatId = chatRef.id;
      }

      navigate(`/chat/${chatId}`); // Navigate to ChatPage with the chatId
    } catch (error) {
      console.error('Error starting private chat:', error);
      // Display an error message to the user or log the error in a more robust way
    }
  };

  const filteredUsers = users.filter(user => 
    user.userName !== currentUser?.userName && 
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="user-list">
      <h2>Users</h2>
      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul>
        {filteredUsers.map(user => (
          <li key={user.id} onClick={() => startPrivateChat(currentUser, user)}>
            <img src={user.profilePicture} alt={`${user.userName}'s profile`} />
            <span>{user.userName}</span>
            <ul>
              {messages[user.id] && messages[user.id].map((message, index) => (
                <li key={index}>{message.content}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
