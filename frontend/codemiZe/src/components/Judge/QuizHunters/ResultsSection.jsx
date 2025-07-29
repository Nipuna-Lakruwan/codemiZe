import React from 'react';
import ResultsList from '../Common/ResultsList';

const ResultsSection = ({ results }) => (
  <div className="flex flex-col h-full relative">
    {/* Game heading - match loading screen style */}
    <div className="absolute left-8 top-8">
      <div className="justify-start text-purple-900 text-4xl font-normal font-['Jersey_25']" style={{ fontFamily: 'Jersey_25' }}>
        Quiz Hunters
      </div>
    </div>
    {/* Spacer to push results below heading */}
    <div className="h-24" />
    <div className="flex flex-col items-center w-full">
      <ResultsList results={results} />
    </div>
  </div>
);

export default ResultsSection;
