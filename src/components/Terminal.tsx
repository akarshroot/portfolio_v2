import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TERMINAL_CONSTANTS } from '../constants/terminal';

interface TerminalProps {
  initialCommands?: (string | React.ReactNode)[];
  prompt?: string;
}

const Terminal: React.FC<TerminalProps> = ({ 
  initialCommands = [], 
  prompt = TERMINAL_CONSTANTS.DEFAULT_PROMPT 
}) => {
  console.log('Terminal rendering with history length:', initialCommands.length);
  
  const [history, setHistory] = useState<(string | React.ReactNode)[]>(initialCommands);
  const [currentCommand, setCurrentCommand] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const terminalRef = useRef<HTMLDivElement>(null);
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const renderCount = useRef<number>(0);
  
  // Increment render count on each render
  renderCount.current += 1;
  console.log(`Terminal render #${renderCount.current}`);
  
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
    console.log('Effective history size:', size);
    return size;
  }, [history]);

  useEffect(() => {
    console.log('Terminal mounted or history changed');
    console.log('Current history:', history);
    
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      console.log('Scrolled terminal to bottom');
    }
    
    // Trim history if it gets too long
    const effectiveSize = getEffectiveHistorySize();
    if (effectiveSize > TERMINAL_CONSTANTS.MAX_VISIBLE_HISTORY * 2) {
      console.log('History too long, trimming...');
      // Trim history while preserving banner if present
      const newHistory = [...history];
      let trimCount = 0;
      while (getEffectiveHistorySize() > TERMINAL_CONSTANTS.MAX_VISIBLE_HISTORY && newHistory.length > 0) {
        newHistory.shift();
        trimCount++;
      }
      console.log(`Trimmed ${trimCount} items from history`);
      setHistory(newHistory);
    }
  }, [history, getEffectiveHistorySize]);

  const executeCommand = useCallback((cmd: string) => {
    console.log(`Executing command: "${cmd}"`);
    let newHistory = [...history, `${prompt}${cmd}`];
    
    // Add command response (simulated)
    if (cmd.trim()) {
      switch(cmd.trim()) {
        case "/help":
          console.log('Executing help command');
          newHistory.push(
            "Available commands:",
            "- /help: Show this help message",
            "- /about: Learn about me",
            "- /resume: Get link to my resume",
            "- /contact: Get my contact information"
          );
          break;
        case "/clear":
          console.log('Executing clear command');
          newHistory = ["Cleared terminal."];
          break;
        default:
          newHistory.push(`${cmd}? What do you mean? I don't understand everything yet. Use /help`);
      }
    }
    
    console.log('Setting new history with length:', newHistory.length);
    setHistory(newHistory);
    setCurrentCommand("");
    setCursorPosition(0);
  }, [history, prompt]);

  // Calculate which items to display based on effective history size
  const getVisibleHistory = useCallback(() => {
    console.log('Calculating visible history');
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
    
    console.log(`Visible history: ${result.length} items, effective size: ${effectiveSize}`);
    return result;
  }, [history]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(currentCommand);
    }
  }, [currentCommand, executeCommand]);

  const handleClick = useCallback(() => {
    console.log('Terminal clicked, focusing input');
    inputRef.current?.focus();
  }, []);

  const handleHelpClick = useCallback((e: React.MouseEvent) => {
    console.log('Help button clicked');
    e.stopPropagation(); // Prevent terminal click handler
    executeCommand("/help");
  }, [executeCommand]);

  console.log('Terminal rendering UI');
  
  return (
    <section 
      className="bg-black text-green-500 font-mono p-4 rounded-md overflow-y-auto flex flex-col h-full"
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
        {getVisibleHistory().map((line, i) => {
          console.log(`Rendering history item ${i}`);
          return (
            React.isValidElement(line) ? 
              <div key={i}>{line}</div> : 
              <pre key={i} className="whitespace-pre-wrap break-all m-0 font-inherit">
                {line}
              </pre>
          );
        })}
      </div>
      
      <div className="mt-2 mb-2 flex justify-start">
        <button 
          className="px-3 py-1 bg-green-700 text-black rounded hover:bg-green-600 focus:outline-none cursor-pointer"
          onClick={handleHelpClick}
          aria-label="Show help commands"
        >
          Help
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
  console.log('Terminal memo comparison');
  console.log('Prev props:', prevProps);
  console.log('Next props:', nextProps);
  
  // Only re-render if props actually changed
  const propsEqual = 
    prevProps.prompt === nextProps.prompt && 
    prevProps.initialCommands?.length === nextProps.initialCommands?.length;
  
  console.log(`Terminal will ${propsEqual ? 'NOT' : ''} re-render`);
  return propsEqual;
});
