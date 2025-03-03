import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styled from 'styled-components';

const MarkdownContainer = styled.div`
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);

  p {
    margin: 0.5em 0;
  }

  pre {
    margin: 0.5em 0;
    padding: 0;
    background: none;
  }

  code {
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
  }

  p > code {
    background-color: var(--bg-hover);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    color: var(--text-primary);
  }
`;

const CodeBlock = styled.div`
  position: relative;
  margin: 0.5em 0;

  pre {
    margin: 0 !important;
    border-radius: 8px;
    padding: 1em !important;
  }

  .react-syntax-highlighter-line-number {
    margin-right: 1.5em !important;
    opacity: 0.5;
  }

  /* Add padding to the code container */
  > div {
    padding: 1em !important;
    margin: 0 !important;
  }

  /* Style the pre element inside SyntaxHighlighter */
  > div > pre {
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
  }

  &:hover .copy-button {
    opacity: 1;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8em;
  color: var(--text-secondary);
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 1;

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }

  &.copied {
    background: var(--accent-primary);
    color: white;
    border-color: transparent;
  }
`;

function MarkdownMessage({ content }) {
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    const button = document.activeElement;
    if (button) {
      button.classList.add('copied');
      button.textContent = 'Copied!';
      setTimeout(() => {
        button.classList.remove('copied');
        button.textContent = 'Copy';
      }, 2000);
    }
  };

  return (
    <MarkdownContainer>
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const code = String(children).replace(/\n$/, '');

            if (!inline && match) {
              return (
                <CodeBlock>
                  <CopyButton
                    className="copy-button"
                    onClick={() => handleCopy(code)}
                  >
                    Copy
                  </CopyButton>
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    showLineNumbers={true}
                    wrapLines={true}
                    customStyle={{
                      margin: 0,
                      background: 'var(--bg-primary)',
                      borderRadius: '6px',
                    }}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                </CodeBlock>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </MarkdownContainer>
  );
}

export default MarkdownMessage; 