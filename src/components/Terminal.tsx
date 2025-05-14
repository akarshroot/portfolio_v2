import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TERMINAL_CONSTANTS } from '../constants/terminal';

interface TerminalProps {
  initialCommands?: (string | React.ReactNode)[];
  prompt?: string;
}

// Helper function to detect and convert URLs to clickable links
const formatTextWithLinks = (text: string) => {
  // URL regex pattern
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // If no URLs in text, return the original text
  if (!urlRegex.test(text)) {
    return text;
  }
  
  // Split text by URLs and create an array of text and link elements
  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex) || [];
  
  return (
    <>
      {parts.map((part, i) => {
        // Even indices are text, odd indices are where URLs were
        if (i % 2 === 0) {
          return part;
        } else {
          const url = matches[(i - 1) / 2];
          return (
            <a 
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {url}
            </a>
          );
        }
      })}
    </>
  );
};

const Terminal: React.FC<TerminalProps> = ({ 
  initialCommands = [], 
  prompt = TERMINAL_CONSTANTS.DEFAULT_PROMPT 
}) => {
  const [history, setHistory] = useState<(string | React.ReactNode)[]>(initialCommands);
  const [currentCommand, setCurrentCommand] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Calculate effective history size, counting banner as multiple lines
  const getEffectiveHistorySize = useCallback(() => {
    let size = 0;
    for (const item of history) {
      // If it's the ASCII banner, count it as multiple lines
      if (React.isValidElement(item) && 
          item.type === 'pre' && 
          item.key === 'formatted') {
        size += TERMINAL_CONSTANTS.BANNER_LINE_COUNT;
      } else {
        size += 1;
      }
    }
    return size;
  }, [history]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    
    // Trim history if it gets too long
    const effectiveSize = getEffectiveHistorySize();
    if (effectiveSize > TERMINAL_CONSTANTS.MAX_VISIBLE_HISTORY * 2) {
      // Trim history while preserving banner if present
      const newHistory = [...history];
      let trimCount = 0;
      while (getEffectiveHistorySize() > TERMINAL_CONSTANTS.MAX_VISIBLE_HISTORY && newHistory.length > 0) {
        newHistory.shift();
        trimCount++;
      }
      setHistory(newHistory);
    }
  }, [history, getEffectiveHistorySize]);

  const executeCommand = useCallback((cmd: string) => {
    let newHistory = [...history, `${prompt}${cmd}`];
    
    // Add command response (simulated)
    if (cmd.trim()) {
      switch(cmd.trim()) {
        case "help":
          newHistory.push(
            "Available commands:",
            "- help: Show this help message",
            "- about: Learn about me",
            "- resume: Get link to my resume",
            "- contact: Get my contact information",
            "- clear: Clear terminal",
          );
          break;
        case "clear":
          newHistory = ["Cleared terminal."];
          break;
        case "resume":
          newHistory.push("View my resume at https://drive.google.com/file/d/1PzfaGtLDuKhgaCHQtriOLcUsidCFIj8T/view?usp=drive_link");
          break;
        case "about":
          newHistory.push(
            "I'm Akarsh Tripathi, a software engineer specializing in backend development.",
            "Check out my GitHub: https://github.com/akarshroot",
            "LinkedIn: https://linkedin.com/in/akarshtripathi-tech"
          );
          break;
        case "contact":
          newHistory.push(
            "Email: work.akarshtripathi@gmail.com",
            "LinkedIn: https://linkedin.com/in/akarshtripathi-tech",
            "GitHub: https://github.com/akarshroot"
          );
          break;
        default:
          newHistory.push(`${cmd}? What do you mean? I don't understand everything yet. Use help`);
      }
    }
    
    setHistory(newHistory);
    setCurrentCommand("");
    setCursorPosition(0);
  }, [history, prompt]);

  // Calculate which items to display based on effective history size
  const getVisibleHistory = useCallback(() => {
    const result = [];
    let effectiveSize = 0;
    
    // Start from the end and work backwards
    for (let i = history.length - 1; i >= 0; i--) {
      const item = history[i];
      const itemSize = React.isValidElement(item) && 
                      item.type === 'pre' && 
                      item.key === 'formatted' ? TERMINAL_CONSTANTS.BANNER_LINE_COUNT : 1;
                      
      if (effectiveSize + itemSize <= TERMINAL_CONSTANTS.MAX_VISIBLE_HISTORY) {
        result.unshift(item);
        effectiveSize += itemSize;
      } else {
        break;
      }
    }
    
    return result;
  }, [history]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(currentCommand);
    }
  }, [currentCommand, executeCommand]);

  const handleClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleHelpClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent terminal click handler
    executeCommand("help");
  }, [executeCommand]);
  
  const handleContactClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent terminal click handler
    executeCommand("contact");
  }, [executeCommand]);
  
  const handleResumeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent terminal click handler
    executeCommand("resume");
  }, [executeCommand]);
  
  // Render a history item with clickable links
  const renderHistoryItem = useCallback((line: string | React.ReactNode, index: number) => {
    if (React.isValidElement(line)) {
      return <div key={index}>{line}</div>;
    }
    
    return (
      <pre key={index} className="whitespace-pre-wrap break-all m-0 font-inherit">
        {typeof line === 'string' ? formatTextWithLinks(line) : line}
      </pre>
    );
  }, []);
  
  return (
    <section 
      className="bg-night text-lavender-blush font-mono p-4 rounded-md overflow-y-auto flex flex-col h-full"
      style={{ backgroundColor: 'var(--night)', color: 'var(--lavender-blush)' }}
      ref={terminalRef}
      onClick={handleClick}
      aria-label="Interactive Terminal"
      role="region"
    >
      <div 
        className="flex-1 overflow-y-auto" 
        ref={historyContainerRef}
        style={{ maxHeight: 'calc(100% - 80px)' }}
        aria-live="polite"
      >
        {getVisibleHistory().map((line, i) => renderHistoryItem(line, i))}
      </div>
      
      <div className="mt-2 mb-2 flex justify-start space-x-2">
        <button 
          className="px-3 py-1 rounded hover:bg-lavender-blush focus:outline-none cursor-pointer"
          style={{ 
            backgroundColor: 'var(--mountbatten-pink)', 
            color: 'var(--night)',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--rose-quartz)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--mountbatten-pink)'}
          onClick={handleHelpClick}
          aria-label="Show help commands"
        >
          Help
        </button>
        <button 
          className="px-3 py-1 rounded hover:bg-lavender-blush focus:outline-none cursor-pointer"
          style={{ 
            backgroundColor: 'var(--mountbatten-pink)', 
            color: 'var(--night)',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--rose-quartz)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--mountbatten-pink)'}
          onClick={handleContactClick}
          aria-label="Show contact information"
        >
          Contact
        </button>
        <button 
          className="px-3 py-1 rounded hover:bg-lavender-blush focus:outline-none cursor-pointer"
          style={{ 
            backgroundColor: 'var(--mountbatten-pink)', 
            color: 'var(--night)',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--rose-quartz)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--mountbatten-pink)'}
          onClick={handleResumeClick}
          aria-label="Show resume link"
        >
          Resume
        </button>
      </div>
      
      <div className="flex items-center" aria-label="Command input">
        <span aria-hidden="true">{prompt}</span>
        <span aria-hidden="true">{currentCommand.substring(0, cursorPosition)}</span>
        <span className="animate-pulse" aria-hidden="true">▌</span>
        <span aria-hidden="true">{currentCommand.substring(cursorPosition)}</span>
        <label htmlFor="terminal-input" className="sr-only">Terminal input</label>
        <input
          id="terminal-input"
          ref={inputRef}
          type="text"
          className="opacity-0 absolute w-0 h-0"
          value={currentCommand}
          onChange={(e) => {
            setCurrentCommand(e.target.value);
            setCursorPosition(e.target.value.length);
          }}
          onKeyDown={handleKeyDown}
          autoFocus
          aria-label="Terminal command input"
        />
      </div>
    </section>
  );
};

// Add component display name for easier debugging
Terminal.displayName = 'Terminal';

export default React.memo(Terminal, (prevProps, nextProps) => {
  // Only re-render if props actually changed
  const propsEqual = 
    prevProps.prompt === nextProps.prompt && 
    prevProps.initialCommands?.length === nextProps.initialCommands?.length;
  
  return propsEqual;
});
