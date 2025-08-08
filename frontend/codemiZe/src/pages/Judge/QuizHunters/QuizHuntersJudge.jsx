import React, { useState, useEffect } from 'react';
import JudgeLayout from '../JudgeLayout';
import LoadingScreen from '../../../components/Judge/QuizHunters/LoadingScreen';
import ResultsSection from '../../../components/Judge/QuizHunters/ResultsSection';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';

const QuizHuntersJudge = () => {
  const [gameStatus, setGameStatus] = useState('running');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch game status and results
  useEffect(() => {
    const fetchGameStatus = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(API_PATHS.JUDGE.GET_QUIZ_HUNTERS_MARKINGS);

        if (response.data && response.data.length > 0) {
          response.data.sort((a, b) => b.score - a.score);
          setResults(response.data);
          setGameStatus('completed');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game status:', error);
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