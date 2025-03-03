import { useState, useEffect, useRef } from 'react'
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
  position: relative;

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`;

const ActionIconButton = styled.button`
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.9rem;

  &:hover {
    background: var(--bg-hover);
    border-color: var(--border-hover);
  }

  &:active {
    transform: translateY(1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const HiddenInput = styled.input`
  display: none;
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
  margin-bottom: 16px;
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
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: var(--bg-hover);
  }

  &:hover .delete-button {
    opacity: 1;
  }
`;

const ChatItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const ChatTitle = styled.div`
  font-weight: 400;
  font-size: 0.95rem;
  color: ${props => props.selected ? 'var(--text-primary)' : 'var(--text-secondary)'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatTimestamp = styled.div`
  font-size: 0.8rem;
  color: var(--text-tertiary);
`;

const MessageActions = styled.div`
  display: flex;
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  padding: 4px;

  ${ChatItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 6px;
  color: var(--text-tertiary);
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;

  &:hover {
    background: rgba(255, 0, 0, 0.1);
    color: #ff4444;
  }

  svg {
    width: 16px;
    height: 16px;
  }
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

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: var(--bg-primary);
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid var(--bg-hover);
  border-radius: 50%;
  border-top-color: var(--border-hover);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 16px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: var(--text-secondary);
  font-size: 1rem;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
`;

const LoadingMessage = styled.div`
  color: white;
  margin-top: 16px;
  font-size: 1rem;
  text-align: center;

  p {
    margin: 8px 0;
    opacity: 0.8;
  }
`;

const BottomSection = styled.div`
  border-top: 1px solid var(--border-color);
  padding-top: 16px;
  margin-top: auto;
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
  const [selectedModel, setSelectedModel] = useState('mistral:latest');
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const [modelsData, chatsData] = await Promise.all([
          api.getModels(),
          api.getChats()
        ]);
        setModels(modelsData);
        if (modelsData && modelsData.length > 0) {
          setSelectedModel(modelsData[0].id);
        }
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
      console.log('Creating new chat with model:', selectedModel);
      const timestamp = new Date().toISOString();
      const chatCount = chats.length + 1;
      const newChat = {
        id: Date.now().toString(),
        title: `New Chat ${chatCount}`,
        messages: [],
        model: selectedModel,
        timestamp
      };

      const createdChat = await api.createChat(selectedModel);
      console.log('Created chat:', createdChat);

      const finalChat = {
        ...newChat,
        id: createdChat.id // Use the ID from the backend
      };

      setChats(prevChats => [finalChat, ...prevChats]);
      setCurrentChat(finalChat);
    } catch (error) {
      console.error('Error creating new chat:', error);
      setError('Failed to create new chat');
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
      setError('Failed to send message');
    }
  };

  const handleDeleteChat = async (chatId, event) => {
    event.stopPropagation(); // Prevent chat selection when deleting
    try {
      await api.deleteChat(chatId);
      setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      setError('Failed to delete chat');
    }
  };

  const handleExportChat = () => {
    if (!currentChat) return;
    
    const chatData = {
      ...currentChat,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${currentChat.title || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportChat = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type && !file.name.endsWith('.json')) {
      setError('Please select a valid JSON file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    try {
      setIsImporting(true);
      const text = await file.text();
      let importedChat;
      
      try {
        importedChat = JSON.parse(text);
      } catch (e) {
        throw new Error('Invalid JSON file format');
      }

      if (!importedChat || !Array.isArray(importedChat.messages)) {
        throw new Error('Invalid chat format: missing messages array');
      }
      
      // Create a new chat with the imported data
      const createdChat = await api.createChat(importedChat.model || selectedModel);
      
      const finalChat = {
        ...importedChat,
        id: createdChat.id,
        timestamp: new Date().toISOString()
      };

      // Set total messages for progress tracking
      setImportProgress({ current: 0, total: importedChat.messages.length });

      // Send all messages in sequence
      for (let i = 0; i < importedChat.messages.length; i++) {
        const message = importedChat.messages[i];
        await api.sendMessage(createdChat.id, message);
        setImportProgress(prev => ({ ...prev, current: i + 1 }));
      }

      setChats(prevChats => [finalChat, ...prevChats]);
      setCurrentChat(finalChat);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Failed to import chat:', error);
      setError(error.message || 'Failed to import chat');
    } finally {
      setIsImporting(false);
      setImportProgress({ current: 0, total: 0 });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <LoadingText>Loading ...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AppContainer>
      {isImporting && (
        <LoadingOverlay>
          <LoadingSpinner />
          <LoadingMessage>
            <div>Importing Chat...</div>
            {importProgress.total > 0 && (
              <p>Processing message {importProgress.current} of {importProgress.total}</p>
            )}
          </LoadingMessage>
        </LoadingOverlay>
      )}
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
                  <ChatTitle selected={currentChat?.id === chat.id}>
                    {chat.title || 'New Chat'}
                  </ChatTitle>
                  <ChatTimestamp>{formatTimestamp(chat.timestamp)}</ChatTimestamp>
                </ChatItemContent>
                <MessageActions>
                  <ActionButton
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    title="Delete chat"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </ActionButton>
                </MessageActions>
              </ChatItem>
            ))}
          </ChatList>
          <BottomSection>
            <ButtonGroup>
              <ActionIconButton 
                onClick={handleExportChat}
                disabled={!currentChat}
                title={currentChat ? "Export current chat" : "Select a chat to export"}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </ActionIconButton>
              <ActionIconButton 
                onClick={handleImportClick}
                title="Import a chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Import
              </ActionIconButton>
            </ButtonGroup>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportChat}
            />
          </BottomSection>
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
            <h2>Welcome to Chatai</h2>
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