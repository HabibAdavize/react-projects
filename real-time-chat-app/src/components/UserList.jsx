import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../hooks/useAuth';

const UserList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUsersAndMessages = async () => {
      try {
        const usersCollection = await getDocs(collection(db, 'users'));
        const usersData = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        console.log('Fetched users:', usersData);

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
        console.log('Fetched messages:', messagesData);
      } catch (error) {
        console.error('Error fetching users or messages:', error);
      }
    };

    fetchUsersAndMessages();
  }, []);

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
          <li key={user.id} onClick={() => onSelectUser(user)}>
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
