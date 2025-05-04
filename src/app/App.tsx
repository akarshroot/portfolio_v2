import React, { useEffect, useState } from 'react';
import './App.css';
import Window from '../components/Window';
import Terminal from '../components/Terminal';
import { ASCII_BANNER, TERMINAL_CONSTANTS } from '../constants/terminal';
import { Helmet } from 'react-helmet';

function App() {
  const [isSmallScreen, setIsSmallScreen] = useState(true);

  useEffect(() => {
    const checkScreenSize = (e: any) => {
      setIsSmallScreen(e.target.innerWidth < 768);
    };
    
    checkScreenSize({ target: window }); // Check on initial render
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const asciiBanner = (
    <pre key="formatted">
      {ASCII_BANNER}                                                                                  
    </pre>
  );

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Akarsh Tripathi",
    "url": "https://akarshtripathi.com",
    "jobTitle": "Software Engineer",
    "sameAs": [
      "https://github.com/akarshroot",
      "https://linkedin.com/in/akarshtripathi-tech"
    ],
    "knowsAbout": [
      "Web Development",
      "React",
      "TypeScript",
      "JavaScript",
      "Machine Learning"
    ]
  };

  return (
    <div className="App">
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <Window>
        <Terminal
          key={`terminal-${isSmallScreen}`}
          initialCommands={[
            "Hi! I'm",
            isSmallScreen ? TERMINAL_CONSTANTS.BANNER_FALLBACK : asciiBanner,
          ]} 
          prompt={TERMINAL_CONSTANTS.DEFAULT_PROMPT}
        />
      </Window>
    </div>
  );
}

export default App;
