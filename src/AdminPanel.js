import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import './AdminPanel.css';

// Initialize Firestore and Auth
const db = getFirestore();
const auth = getAuth();

function AdminPanel() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate(); 

  // Fetch list of chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsCollection = collection(db, 'chats');
        const chatsSnapshot = await getDocs(chatsCollection);

        if (chatsSnapshot.empty) {
          console.log('No chats found.');
        } else {
          const chatsData = chatsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setChats(chatsData);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    fetchChats();
  }, []);

  // Fetch messages when a chat is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedChat) {
        try {
          const messagesCollection = collection(db, 'chats', selectedChat, 'messages');
          const messagesQuery = query(messagesCollection, orderBy('createdAt', 'asc'));
          const messagesSnapshot = await getDocs(messagesQuery);

          if (messagesSnapshot.empty) {
            console.log('No messages found for this chat.');
          } else {
            const messagesData = messagesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setMessages(messagesData);
          }
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Handle chat selection
  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
  };

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageData = {
      text: newMessage,
      createdAt: serverTimestamp(),
      sender: 'admin',
    };

    try {
      const messagesCollection = collection(db, 'chats', selectedChat, 'messages');
      await addDoc(messagesCollection, messageData);
      setNewMessage('');
      // Refresh messages
      const messagesSnapshot = await getDocs(query(messagesCollection, orderBy('createdAt')));
      const messagesData = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirect to the sign-in page after signing out
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="admin-panel">
      {/* Sign Out Button */}
      <button className="sign-out-button" onClick={handleSignOut}>Sign Out</button>
      
      <div className="main-content">
        {/* Chat List */}
        <div className="chat-list">
          <h2>Chats</h2>
          <ul>
            {chats.map(chat => (
              <li key={chat.id} onClick={() => handleChatSelect(chat.id)} className={selectedChat === chat.id ? 'selected' : ''}>
                Chat with {chat.id}
              </li>
            ))}
          </ul>
        </div>

        {/* Selected Chat Messages */}
        {selectedChat && (
          <div className="chat-messages">
            <h2>Messages for {selectedChat}</h2>
            <div className="messages">
              {messages.map(message => (
                <div key={message.id} className={`message ${message.sender === 'admin' ? 'admin-message' : 'user-message'}`}>
                  <strong>{message.sender}:</strong> {message.text}
                </div>
              ))}
            </div>

            {/* Message Input and Send Button */}
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
