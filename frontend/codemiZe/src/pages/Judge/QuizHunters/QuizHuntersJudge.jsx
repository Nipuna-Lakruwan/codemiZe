import React, { useState, useEffect } from 'react';
import JudgeLayout from '../JudgeLayout';
import LoadingScreen from '../../../components/Judge/QuizHunters/LoadingScreen';
import ResultsSection from '../../../components/Judge/QuizHunters/ResultsSection';

// QuizHuntersJudge: Main judge page for Quiz Hunters game
const QuizHuntersJudge = () => {
  // Game status: 'running' or 'completed'
  const [gameStatus, setGameStatus] = useState('running');
  // Results array for completed state
  const [results, setResults] = useState([]);
  // Loading spinner state
  const [loading, setLoading] = useState(true);

  // Simulate fetching game status and results
  useEffect(() => {
    const fetchGameStatus = async () => {
      setLoading(true);
      try {
        setTimeout(() => {
          // Randomly set status for demo
          const status = Math.random() > 0.5 ? 'running' : 'completed';
          setGameStatus(status);
          if (status === 'completed') {
            // Mock results for leaderboard
            const mockResults = [
              { id: 1, name: 'Royal College', city: 'Colombo', nameInShort: 'RC', score: 95, avatar: { url: '/c-logo.png' } },
              { id: 2, name: 'Ananda College', city: 'Colombo', nameInShort: 'AC', score: 87, avatar: { url: '/c-logo.png' } },
              { id: 3, name: 'St. Joseph\'s College', city: 'Colombo', nameInShort: 'SJC', score: 83, avatar: { url: '/c-logo.png' } },
              { id: 4, name: 'D.S. Senanayake College', city: 'Colombo', nameInShort: 'DSC', score: 78, avatar: { url: '/c-logo.png' } },
              { id: 5, name: 'Visakha Vidyalaya', city: 'Colombo', nameInShort: 'VV', score: 75, avatar: { url: '/c-logo.png' } },
              { id: 6, name: 'Mahanama College', city: 'Colombo', nameInShort: 'MC', score: 73, avatar: { url: '/c-logo.png' } },
              { id: 7, name: 'Nalanda College', city: 'Colombo', nameInShort: 'NC', score: 70, avatar: { url: '/c-logo.png' } },
            ];
            mockResults.sort((a, b) => b.score - a.score);
            setResults(mockResults);
          }
          setLoading(false);
        }, 1500);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchGameStatus();
  }, []);

  return (
    <JudgeLayout gameName="Quiz Hunters">
      {/* Show loading or running state */}
      {loading || gameStatus === 'running' ? (
        <LoadingScreen />
      ) : (
        // Show leaderboard/results when completed
        <ResultsSection results={results} />
      )}
    </JudgeLayout>
  );
};

export default QuizHuntersJudge;