import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { firestore, auth } from './firebase'; // Import Firestore and Auth from the correct module
import { collection, getDocs, doc, orderBy, serverTimestamp, query, addDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
 // Import necessary Firestore functions
import AdminPanel from './AdminPanel'; 
import SignIn from './SignIn';
import './App.css';

const db = getFirestore();
function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userMessages, setUserMessages] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
  
    const fetchChats = async () => {
      try {
        const chatsCollection = collection(db, 'chats');
        const chatsSnapshot = await getDocs(chatsCollection);
        console.log('Chats Snapshot:', chatsSnapshot); // Log the snapshot
        console.log('Chats Snapshot Size:', chatsSnapshot.size); // Log the size
        console.log('Chats Snapshot Empty:', chatsSnapshot.empty); // Check if empty
        
        if (chatsSnapshot.empty) {
          console.log('No chats found.');
        } else {
          const chatsData = chatsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log('Chats Data:', chatsData); // Log the chat data
          setMessages(chatsData);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };
  
    fetchChats();
  }, [user]);
  // Fetch user messages for a selected chat
  const fetchUserMessages = useCallback(async (chatId) => {
    setSelectedUser(chatId);
    try {
      const messagesCollection = collection(firestore, 'chats', chatId, 'messages');
      const messagesQuery = query(messagesCollection, orderBy('createdAt', 'asc'));
      const messagesSnapshot = await getDocs(messagesQuery);

      if (messagesSnapshot.empty) {
        console.log('No messages found for user.');
      } else {
        const userMessagesData = messagesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserMessages(userMessagesData);
      }
    } catch (error) {
      console.error('Error fetching user messages:', error);
    }
  }, []);

  // Send a new message in the selected chat
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    const messageData = {
      text: newMessage,
      createdAt: serverTimestamp(),
      sender: 'admin',
    };

    try {
      const messagesCollection = collection(firestore, 'chats', selectedUser, 'messages');
      await addDoc(messagesCollection, messageData);
      setNewMessage('');
      fetchUserMessages(selectedUser); // Refresh the chat
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPanel fetchUserMessages={fetchUserMessages} userMessages={userMessages} />} />
        <Route path="/" element={<SignIn />} />
      </Routes>
    </Router>
  );
}

export default App;

 

