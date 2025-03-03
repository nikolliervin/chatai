import { useState, useEffect } from 'react'
import styled from 'styled-components'
import ChatWindow from './components/ChatWindow'
import * as api from './services/api'

// Styled components
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;
`;

const Sidebar = styled.div`
  width: 300px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
`;

const NewChatButton = styled.button`
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0073e6;
  }
`;

const ModelSelect = styled.select`
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 20px;
  width: 100%;
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChatItem = styled.div`
  padding: 12px;
  margin: 4px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.selected ? '#f0f2f5' : 'transparent'};

  &:hover {
    background-color: #f0f2f5;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  text-align: center;
  padding: 20px;

  h2 {
    margin-bottom: 10px;
  }

  p {
    max-width: 400px;
    line-height: 1.5;
  }
`;

function App() {
  const [chats, setChats] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [modelsData, chatsData] = await Promise.all([
          api.getModels(),
          api.getChats()
        ]);
        setModels(modelsData);
        setChats(chatsData);
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleNewChat = async () => {
    try {
      const newChat = await api.createChat(selectedModel);
      setChats([...chats, newChat]);
      setCurrentChat(newChat);
    } catch (err) {
      console.error('Failed to create new chat:', err);
    }
  };

  const handleSendMessage = async (message) => {
    if (!currentChat) return;

    try {
      // Add user message to chat immediately for UI responsiveness
      const updatedChat = {
        ...currentChat,
        messages: [...currentChat.messages, message]
      };

      // Update local state
      setChats(chats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      ));
      setCurrentChat(updatedChat);

      // Send message to backend
      const response = await api.sendMessage(currentChat.id, message);
      
      // Update chat with AI response
      const chatWithResponse = {
        ...updatedChat,
        messages: [...updatedChat.messages, response.response]
      };

      setChats(chats.map(chat => 
        chat.id === currentChat.id ? chatWithResponse : chat
      ));
      setCurrentChat(chatWithResponse);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AppContainer>
      <Sidebar>
        <NewChatButton onClick={handleNewChat}>
          New Chat
        </NewChatButton>
        <ModelSelect
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {models.map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </ModelSelect>
        <ChatList>
          {chats.map(chat => (
            <ChatItem
              key={chat.id}
              selected={currentChat?.id === chat.id}
              onClick={() => setCurrentChat(chat)}
            >
              {chat.title}
            </ChatItem>
          ))}
        </ChatList>
      </Sidebar>
      <ChatContainer>
        {currentChat ? (
          <ChatWindow
            currentChat={currentChat}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <EmptyState>
            <h2>Welcome to the Chat App</h2>
            <p>
              Start a new conversation by clicking the "New Chat" button on the left.
              You can choose different AI models from the dropdown menu.
            </p>
          </EmptyState>
        )}
      </ChatContainer>
    </AppContainer>
  );
}

export default App
