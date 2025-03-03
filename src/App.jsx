import { useState } from 'react'
import styled from 'styled-components'
import ChatWindow from './components/ChatWindow'

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
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [currentChat, setCurrentChat] = useState(null);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Chat',
      messages: []
    };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
  };

  const handleSendMessage = async (message) => {
    if (!currentChat) return;

    // Add user message to chat
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, message]
    };

    // Update chat in state
    setChats(chats.map(chat => 
      chat.id === currentChat.id ? updatedChat : chat
    ));
    setCurrentChat(updatedChat);

    // TODO: Add API call to get model response
    // For now, we'll simulate a response
    setTimeout(() => {
      const assistantMessage = {
        role: 'assistant',
        content: `This is a simulated response to: "${message.content}"`
      };
      
      const chatWithResponse = {
        ...updatedChat,
        messages: [...updatedChat.messages, assistantMessage]
      };

      setChats(chats.map(chat => 
        chat.id === currentChat.id ? chatWithResponse : chat
      ));
      setCurrentChat(chatWithResponse);
    }, 1000);
  };

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
          <option value="gpt-3.5-turbo">GPT-3.5</option>
          <option value="gpt-4">GPT-4</option>
          <option value="deepseek">DeepSeek</option>
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
