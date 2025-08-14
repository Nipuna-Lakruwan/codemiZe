import React from 'react';
import ResultsList from '../Common/ResultsList';

const ResultsSection = ({ results }) => (
  <div className="flex flex-col h-full relative">
    {/* Spacer to push results below heading */}
    <div className="h-24" />
    <div className="flex flex-col items-center w-full ">
      <ResultsList results={results} />
    </div>
  </div>
);

export default ResultsSection;
