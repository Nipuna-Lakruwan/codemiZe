import React, { useState, useEffect, useContext } from 'react';
import JudgeLayout from '../JudgeLayout';
import LoadingScreen from '../../../components/Judge/QuizHunters/LoadingScreen';
import ResultsSection from '../../../components/Judge/QuizHunters/ResultsSection';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import { SocketContext } from '../../../context/socketContext';

const QuizHuntersJudge = () => {
  const socket = useContext(SocketContext);
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

    // Setup socket connection and listener
    if (socket) {
      socket.on('quizhunters completed', (schoolData) => {
        setResults(prevResults => {
          // Prevent duplicates
          const exists = prevResults.some(r => r.schoolId === schoolData.schoolId);
          if (exists) return prevResults;
          const updated = [...prevResults, schoolData].sort((a, b) => b.score - a.score);
          return updated;
        });
      });
    }
    return () => {
      if (socket) {
        socket.off('quizhunters completed');
      }
    };
  }, []);

  // Filter out schools with score 0
  const filteredResults = results.filter(school => school.score > 0);

  return (
    <JudgeLayout>
      <div className="absolute left-20 top-10">
        <div className="justify-start text-purple-900 text-4xl font-normal font-['Jersey_25']" style={{ fontFamily: 'Jersey_25' }}>
            Quiz Hunters
        </div>
      </div>
      {/* Show loading or running state */}
      {loading || gameStatus === 'running' ? (
        <LoadingScreen />
      ) : (
        // Show leaderboard/results when completed
        <ResultsSection results={filteredResults} />
      )}
    </JudgeLayout>
  );
};

export default QuizHuntersJudge;