import React, { useState, useEffect } from 'react';
import JudgeLayout from '../JudgeLayout';
import ResultsList from '../../../components/Judge/Common/ResultsList';
import ScrollbarStyles from '../../../components/Admin/UserManagement/ScrollbarStyles';

const QuizHuntersJudge = () => {
  // State to track if the game is running or completed
  const [gameStatus, setGameStatus] = useState('running'); // 'running' or 'completed'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulate fetching game status and results
  useEffect(() => {
    // This would be replaced with actual API call
    const fetchGameStatus = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        setTimeout(() => {
          // For demo purposes, let's randomly decide if game is running or completed
          // In real implementation, this would come from the backend
          const status = Math.random() > 0.5 ? 'running' : 'completed';

          setGameStatus(status);

          // If game is completed, set mock results
          if (status === 'completed') {
            const mockResults = [
              { id: 1, name: 'Royal College', city: 'Colombo', nameInShort: 'RC', score: 95, avatar: { url: '/c-logo.png' } },
              { id: 2, name: 'Ananda College', city: 'Colombo', nameInShort: 'AC', score: 87, avatar: { url: '/c-logo.png' } },
              { id: 3, name: 'St. Joseph\'s College', city: 'Colombo', nameInShort: 'SJC', score: 83, avatar: { url: '/c-logo.png' } },
              { id: 4, name: 'D.S. Senanayake College', city: 'Colombo', nameInShort: 'DSC', score: 78, avatar: { url: '/c-logo.png' } },
              { id: 5, name: 'Visakha Vidyalaya', city: 'Colombo', nameInShort: 'VV', score: 75, avatar: { url: '/c-logo.png' } },
              { id: 6, name: 'Mahanama College', city: 'Colombo', nameInShort: 'MC', score: 73, avatar: { url: '/c-logo.png' } },
              { id: 7, name: 'Nalanda College', city: 'Colombo', nameInShort: 'NC', score: 70, avatar: { url: '/c-logo.png' } },
            ];

            // Sort results by score (highest first)
            mockResults.sort((a, b) => b.score - a.score);
            setResults(mockResults);
          }

          setLoading(false);
        }, 1500); // Simulate 1.5s API delay
      } catch (error) {
        console.error("Error fetching game status:", error);
        setLoading(false);
      }
    };

    fetchGameStatus();
  }, []);

  return (
    <JudgeLayout gameName="Quiz Hunters">
      <ScrollbarStyles />
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      ) : (
        <div className="text-gray-800 h-full">
          {gameStatus === 'running' ? (
            // Game is still running - show waiting message
            <div className="flex flex-col items-center justify-center h-full">
              <img src="/loading.gif" alt="Loading" className="h-20 w-auto mb-6" />
              <div className="justify-start text-sky-600 text-4xl font-bold font-['Oxanium']">
                Waiting For Results
              </div>
              <p className="text-gray-500 mt-4">The Quiz Hunters game is in progress. Results will appear here once the game is completed.</p>
            </div>
          ) : (
            // Game is completed - show results
            <div className="flex flex-col h-full">
              <div className="mb-4 flex items-center">
                <h2 className="text-2xl font-semibold">Quiz Hunters Results</h2>
                <div className="ml-auto flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Last updated:</span>
                  <span className="text-sm font-medium">{new Date().toLocaleString()}</span>
                </div>
              </div>

              <ResultsList results={results} />
            </div>
          )}
        </div>
      )}
    </JudgeLayout>
  );
};

export default QuizHuntersJudge;
