import React, { useState, useEffect, useRef } from 'react';
import { TERMINAL_CONSTANTS } from '../constants/terminal';

interface TerminalProps {
  initialCommands?: (string | React.ReactNode)[];
  prompt?: string;
}

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
  const getEffectiveHistorySize = () => {
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
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    
    // Trim history if it gets too long
    const effectiveSize = getEffectiveHistorySize();
    if (effectiveSize > TERMINAL_CONSTANTS.MAX_VISIBLE_HISTORY * 2) {
      // Trim history while preserving banner if present
      const newHistory = [...history];
      while (getEffectiveHistorySize() > TERMINAL_CONSTANTS.MAX_VISIBLE_HISTORY) {
        newHistory.shift();
      }
      setHistory(newHistory);
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    let newHistory = [...history, `${prompt}${cmd}`];
    
    // Add command response (simulated)
    if (cmd.trim()) {
      switch(cmd.trim()) {
        case "/help":
          newHistory.push(
            "Available commands:",
            "- /help: Show this help message",
            "- /about: Learn about me",
            "- /resume: Get link to my resume",
            "- /contact: Get my contact information"
          );
          break;
        case "/clear":
          newHistory = ["Cleared terminal."];
          break;
        default:
          newHistory.push(`Command '${cmd}' executed.`);
      }
    }
    
    setHistory(newHistory);
    setCurrentCommand("");
    setCursorPosition(0);
  };

  // Calculate which items to display based on effective history size
  const getVisibleHistory = () => {
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
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(currentCommand);
    }
  };

  const handleClick = () => {
    inputRef.current?.focus();
  };

  const handleHelpClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent terminal click handler
    executeCommand("/help");
  };

  return (
    <div 
      className="bg-black text-green-500 font-mono p-4 rounded-md overflow-y-auto flex flex-col h-full"
      ref={terminalRef}
      onClick={handleClick}
    >
      <div 
        className="flex-1 overflow-y-auto" 
        ref={historyContainerRef}
        style={{ maxHeight: 'calc(100% - 80px)' }}
      >
        {getVisibleHistory().map((line, i) => (
          React.isValidElement(line) ? 
            <div key={i}>{line}</div> : 
            <pre key={i} className="whitespace-pre-wrap break-all m-0 font-inherit">
              {line}
            </pre>
        ))}
      </div>
      
      <div className="mt-2 mb-2 flex justify-start">
        <button 
          className="px-3 py-1 bg-green-700 text-black rounded hover:bg-green-600 focus:outline-none cursor-pointer"
          onClick={handleHelpClick}
        >
          Help
        </button>
      </div>
      
      <div className="flex items-center">
        <span>{prompt}</span>
        <span>{currentCommand.substring(0, cursorPosition)}</span>
        <span className="animate-pulse">▌</span>
        <span>{currentCommand.substring(cursorPosition)}</span>
        <input
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
        />
      </div>
    </div>
  );
};

export default Terminal;
