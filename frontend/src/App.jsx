import { useState, useEffect } from 'react'
import styled from 'styled-components'
import ChatWindow from './components/ChatWindow'
import * as api from './services/api'

// Styled components
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
`;

const SidebarContainer = styled.div`
  position: relative;
  display: flex;
`;

const Sidebar = styled.div`
  width: ${props => props.isCollapsed ? '0' : '300px'};
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: ${props => props.isCollapsed ? '0' : '20px'};
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;

  & > * {
    opacity: ${props => props.isCollapsed ? '0' : '1'};
    transition: opacity 0.2s ease;
  }
`;

const ToggleSidebarButton = styled.button`
  position: absolute;
  top: 20px;
  left: ${props => props.isCollapsed ? '12px' : '288px'};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  padding: 0;
  transition: all 0.3s ease;
  transform: ${props => props.isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'};

  &:hover {
    background: var(--bg-hover);
    border-color: var(--border-hover);
  }

  svg {
    width: 16px;
    height: 16px;
    color: var(--text-secondary);
  }
`;

const TopSection = styled.div`
  margin-bottom: 32px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 24px;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
`;

const NewChatButton = styled.button`
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 12px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: var(--bg-hover);
    border-color: var(--border-hover);
  }

  &:active {
    transform: translateY(1px);
  }

  span {
    position: relative;
  }
`;

const ModelSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-top: 16px;
  width: 100%;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 14px;
  padding-right: 36px;

  &:hover {
    background-color: var(--bg-hover);
    border-color: var(--border-hover);
  }

  &:focus {
    border-color: var(--border-hover);
    outline: none;
  }

  option {
    background-color: var(--bg-primary);
    color: var(--text-primary);
    padding: 8px;
    font-size: 0.95rem;
  }
`;

const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
`;

const ChatItem = styled.div`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.selected ? 'var(--bg-hover)' : 'transparent'};
  color: var(--text-primary);
  border: 1px solid ${props => props.selected ? 'var(--border-hover)' : 'transparent'};
  position: relative;

  &:hover {
    background-color: var(--bg-hover);
  }

  &:after {
    display: none;
  }
`;

const ChatItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ChatTitle = styled.div`
  font-weight: 400;
  font-size: 0.95rem;
  color: ${props => props.selected ? 'var(--text-primary)' : 'var(--text-secondary)'};
`;

const ChatTimestamp = styled.div`
  font-size: 0.8rem;
  color: var(--text-tertiary);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
  text-align: center;
  padding: 20px;
  background: var(--bg-primary);

  h2 {
    margin-bottom: 16px;
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 500;
  }

  p {
    max-width: 400px;
    line-height: 1.6;
    font-size: 0.95rem;
    color: var(--text-secondary);
  }
`;

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now - 86400000).toDateString() === date.toDateString();
  
  const time = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });

  if (isToday) {
    return `Today, ${time}`;
  } else if (isYesterday) {
    return `Yesterday, ${time}`;
  } else {
    return `${date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })}, ${time}`;
  }
}

function App() {
  const [chats, setChats] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [modelsData, chatsData] = await Promise.all([
          api.getModels(),
          api.getChats()
        ]);
        setModels(modelsData);
        // Add timestamps to existing chats if they don't have one
        const chatsWithTimestamps = chatsData.map(chat => ({
          ...chat,
          timestamp: chat.timestamp || new Date().toISOString()
        }));
        setChats(chatsWithTimestamps);
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
      const timestamp = new Date().toISOString();
      const newChat = await api.createChat(selectedModel);
      const chatWithTimestamp = {
        ...newChat,
        timestamp,
        title: `New Chat ${chats.length + 1}`,
      };
      setChats([...chats, chatWithTimestamp]);
      setCurrentChat(chatWithTimestamp);
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
      <SidebarContainer>
        <Sidebar isCollapsed={isSidebarCollapsed}>
          <TopSection>
            <NewChatButton onClick={handleNewChat}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>New Chat</span>
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
          </TopSection>
          <ChatList>
            {chats.map(chat => (
              <ChatItem
                key={chat.id}
                selected={currentChat?.id === chat.id}
                onClick={() => setCurrentChat(chat)}
              >
                <ChatItemContent>
                  <ChatTitle selected={currentChat?.id === chat.id}>{chat.title || 'New Chat'}</ChatTitle>
                  <ChatTimestamp>{formatTimestamp(chat.timestamp)}</ChatTimestamp>
                </ChatItemContent>
              </ChatItem>
            ))}
          </ChatList>
        </Sidebar>
        <ToggleSidebarButton
          isCollapsed={isSidebarCollapsed}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </ToggleSidebarButton>
      </SidebarContainer>
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
