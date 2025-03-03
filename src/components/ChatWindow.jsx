import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const UserMessage = styled(Message)`
  justify-content: flex-end;
  
  .message-content {
    background-color: #0084ff;
    color: white;
    border-radius: 18px 18px 0 18px;
  }
`;

const AssistantMessage = styled(Message)`
  justify-content: flex-start;
  
  .message-content {
    background-color: #f0f2f5;
    color: black;
    border-radius: 18px 18px 18px 0;
  }
`;

const MessageContent = styled.div`
  padding: 12px 16px;
  max-width: 70%;
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
`;

const Input = styled.textarea`
  flex: 1;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  min-height: 24px;
  max-height: 200px;

  &:focus {
    outline: none;
    border-color: #0084ff;
  }
`;

const SendButton = styled.button`
  background-color: #0084ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0073e6;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

function ChatWindow({ currentChat, onSendMessage }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const newMessage = {
      role: 'user',
      content: message.trim()
    };
    
    onSendMessage(newMessage);
    setMessage('');
    setIsTyping(true);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {currentChat?.messages.map((msg, index) => (
          msg.role === 'user' ? (
            <UserMessage key={index}>
              <MessageContent className="message-content">
                {msg.content}
              </MessageContent>
            </UserMessage>
          ) : (
            <AssistantMessage key={index}>
              <MessageContent className="message-content">
                {msg.content}
              </MessageContent>
            </AssistantMessage>
          )
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
        />
        <SendButton
          onClick={handleSend}
          disabled={!message.trim() || isTyping}
        >
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatWindow; 