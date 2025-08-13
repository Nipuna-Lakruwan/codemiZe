import React from 'react';

const CustomScrollbarStyles = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #5b21b6;
        border-radius: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #4c1d95;
      }
    `
  }} />
);

export default CustomScrollbarStyles;
