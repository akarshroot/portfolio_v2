import React, { ReactNode, useEffect, useState } from 'react'
import './Window.css'

interface WindowProps {
  children?: ReactNode;
}

function Window({ children }: WindowProps) {
  const [windowHeight, setWindowHeight] = useState('90vh');
  const [windowWidth, setWindowWidth] = useState('95%');

  useEffect(() => {
    const updateDimensions = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      
      // Height: Set to viewport height minus a small margin
      // Ensure there's enough space at the bottom
      setWindowHeight(`${Math.min(height * 0.95, height - 30)}px`);
      
      // Width: 95% on mobile, 90% on tablets, 80% on desktop, max 1200px
      if (width < 640) {
        setWindowWidth('95%');
      } else if (width < 1024) {
        setWindowWidth('90%');
      } else {
        setWindowWidth(`${Math.min(width * 0.8, 1200)}px`);
      }
    };

    updateDimensions(); // Set initial dimensions
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div 
        className="border border-gray-100/20 shadow-2xl rounded-tl-lg rounded-tr-lg flex flex-col"
        style={{ height: windowHeight, width: windowWidth }}
      >
        <div className="py-2 px-2 border-b border-gray-100/20 rounded-tl-md rounded-tr-md flex justify-end items-center relative z-10">
          <div className="absolute top-0 left-0 bottom-0 w-14 border-r border-gray-100/20"></div>
          {/* <button className="button-48" role="button"><span className="text">Blog</span></button> */}
          <br />
        </div>
        <div className="flex flex-1 relative -mt-px overflow-hidden">
          <div className="w-14 border-r border-gray-100/20 self-stretch">
            {/* Sidebar content */}
          </div>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Window
