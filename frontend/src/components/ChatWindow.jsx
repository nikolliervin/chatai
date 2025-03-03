import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import MarkdownMessage from './MarkdownMessage';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--bg-primary);
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
`;

const MessageWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  flex-direction: ${props => props.isUser ? 'row-reverse' : 'row'};
`;

const MessageActions = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  align-self: flex-start;

  ${MessageWrapper}:hover & {
    opacity: 1;
  }
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.3s ease forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const UserMessage = styled(Message)`
  justify-content: flex-end;
  
  .message-content {
    background: linear-gradient(135deg, #00dc82, #36e4da);
    color: white;
    border-radius: 18px 18px 0 18px;
    box-shadow: 0 4px 15px rgba(0, 220, 130, 0.2);
  }
`;

const AssistantMessage = styled(Message)`
  justify-content: flex-start;
  
  .message-content {
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    border-radius: 18px 18px 18px 0;
    border: 2px solid var(--border-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const MessageContent = styled.div`
  padding: 12px 16px;
  max-width: 70%;
  word-wrap: break-word;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background-color: var(--bg-secondary);
  border-radius: 18px 18px 18px 0;
  border: 2px solid var(--border-color);
  max-width: 100px;
  margin-bottom: 10px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.3s ease forwards;

  span {
    width: 8px;
    height: 8px;
    background-color: var(--text-secondary);
    border-radius: 50%;
    display: inline-block;
    animation: bounce 1.4s infinite ease-in-out;

    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }

  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-8px); }
  }
`;

const TypewriterText = styled.div`
  .typing {
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
  }

  .typed {
    display: inline;
    opacity: 1;
  }

  .cursor {
    display: inline-block;
    width: 2px;
    height: 1em;
    background-color: var(--text-primary);
    margin-left: 2px;
    animation: blink 1s infinite;
    vertical-align: middle;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 20px;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.textarea`
  flex: 1;
  padding: 14px 18px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  min-height: 24px;
  max-height: 200px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    border-color: #00dc82;
    box-shadow: 0 0 0 3px rgba(0, 220, 130, 0.2);
  }

  &::placeholder {
    color: var(--text-secondary);
  }

  &:hover {
    border-color: #00dc82;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #00dc82, #36e4da);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 220, 130, 0.3);
  min-width: 100px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #36e4da, #00dc82);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 220, 130, 0.4);
  }

  &:hover:before {
    opacity: 1;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(0, 220, 130, 0.3);
  }

  &:disabled {
    background: #4a4a4a;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.7;
  }

  span {
    position: relative;
    z-index: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  color: var(--text-secondary);
  border-radius: 4px;
  box-shadow: none;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const EditInput = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 2px solid var(--accent-primary);
  border-radius: 18px;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  min-height: 60px;
  margin-bottom: 8px;
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

function ChatWindow({ currentChat, onSendMessage }) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [typingIndex, setTypingIndex] = useState(-1);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages, isTyping]);

  useEffect(() => {
    // Start typing effect when a new assistant message is added
    if (currentChat?.messages) {
      const lastMessage = currentChat.messages[currentChat.messages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        setTypingIndex(currentChat.messages.length - 1);
        setIsTyping(true);
        
        // Simulate typing delay based on message length
        const typingDuration = Math.min(lastMessage.content.length * 20, 2000);
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
          setTypingIndex(-1);
        }, typingDuration);
      }
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [currentChat?.messages]);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    const newMessage = {
      role: 'user',
      content: message.trim()
    };
    
    setMessage('');
    setIsTyping(true);
    onSendMessage(newMessage);
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleEdit = (message, index) => {
    setEditingMessage(index);
    setEditContent(message.content);
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editingMessage === null) return;

    const editedMessage = {
      role: 'user',
      content: editContent.trim()
    };

    // Remove all messages after the edited message
    const previousMessages = currentChat.messages.slice(0, editingMessage);
    
    // Update the chat with previous messages and the edited message
    const updatedChat = {
      ...currentChat,
      messages: [...previousMessages, editedMessage]
    };

    // Send the edited message
    onSendMessage(editedMessage);
    
    // Reset edit state
    setEditingMessage(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditContent('');
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
              {editingMessage === index ? (
                <div style={{ width: '100%' }}>
                  <EditInput
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autoFocus
                  />
                  <EditActions>
                    <ActionButton onClick={handleCancelEdit}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </ActionButton>
                    <ActionButton onClick={handleSaveEdit}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </ActionButton>
                  </EditActions>
                </div>
              ) : (
                <MessageWrapper isUser={true}>
                  <MessageContent className="message-content">
                    <MarkdownMessage content={msg.content} />
                  </MessageContent>
                  <MessageActions>
                    <ActionButton onClick={() => handleCopy(msg.content)} title="Copy message">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                      </svg>
                    </ActionButton>
                    <ActionButton onClick={() => handleEdit(msg, index)} title="Edit message">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </ActionButton>
                  </MessageActions>
                </MessageWrapper>
              )}
            </UserMessage>
          ) : (
            <AssistantMessage key={index}>
              <MessageWrapper isUser={false}>
                <MessageContent className="message-content">
                  <TypewriterText>
                    {index === typingIndex ? (
                      <>
                        <span className="typing">
                          <MarkdownMessage content={msg.content} />
                        </span>
                        <span className="cursor" />
                      </>
                    ) : (
                      <span className="typed">
                        <MarkdownMessage content={msg.content} />
                      </span>
                    )}
                  </TypewriterText>
                </MessageContent>
                <MessageActions>
                  <ActionButton onClick={() => handleCopy(msg.content)} title="Copy message">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </ActionButton>
                </MessageActions>
              </MessageWrapper>
            </AssistantMessage>
          )
        ))}
        {isTyping && !currentChat?.messages[typingIndex] && (
          <AssistantMessage>
            <MessageWrapper isUser={false}>
              <TypingIndicator>
                <span></span>
                <span></span>
                <span></span>
              </TypingIndicator>
            </MessageWrapper>
          </AssistantMessage>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      <InputContainer>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          rows={1}
          disabled={isTyping}
        />
        <SendButton
          onClick={handleSend}
          disabled={!message.trim() || isTyping}
        >
          <span>{isTyping ? 'Thinking...' : 'Send'}</span>
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
}

export default ChatWindow;