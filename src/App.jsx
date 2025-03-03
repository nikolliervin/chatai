import { useState } from 'react'
import styled from 'styled-components'

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

const ChatWindow = styled.div`
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

  &:hover {
    background-color: #f0f2f5;
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
              onClick={() => setCurrentChat(chat)}
            >
              {chat.title}
            </ChatItem>
          ))}
        </ChatList>
      </Sidebar>
      <ChatWindow>
        {/* Chat components will be added here */}
      </ChatWindow>
    </AppContainer>
  );
}

export default App
