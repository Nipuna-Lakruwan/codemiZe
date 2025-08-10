import React, { useState, useEffect, useContext } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import TeamRankItem from '../../../components/Admin/TeamRankItem';
import GameActionModal from '../../../components/modals/GameActionModal';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import { SocketContext } from '../../../context/SocketContext';

export default function Dashboard() {
  // State
  const socket = useContext(SocketContext);
  const [selectedScore, setSelectedScore] = useState('overall');
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [games, setGames] = useState([]);
  const [teamScores, setTeamScores] = useState({});

  // Dynamically get active game from games array
  const activeGame = games.find(game => game.status === 'active') || null;

  // Socket listeners for Circuit Smashers timer synchronization
  useEffect(() => {
    if (socket && activeGame && activeGame.name === 'Circuit Smashers') {
      // Listen for server timer updates
      socket.on('circuitSmashers-timerUpdate', (data) => {
        console.log('Circuit Smashers: Timer update', data.timeRemaining);
        setTimeRemaining(data.timeRemaining);
      });

      // Listen for time up event from server
      socket.on('circuitSmashers-timeUp', (data) => {
        console.log('Circuit Smashers: Time up event');
        setTimeRemaining(0);
      });

      // Listen for timer stopped event from server
      socket.on('circuitSmashers-timerStopped', (data) => {
        console.log('Circuit Smashers: Timer stopped event');
        setTimeRemaining(0);
      });

      // Listen for round started event
      socket.on('circuitSmashers-roundStarted', (data) => {
        console.log('Circuit Smashers: Round started', data);
        if (data.allocatedTime) {
          setTimeRemaining(data.allocatedTime);
        }
      });

      // Cleanup listeners
      return () => {
        socket.off('circuitSmashers-timerUpdate');
        socket.off('circuitSmashers-timeUp');
        socket.off('circuitSmashers-timerStopped');
        socket.off('circuitSmashers-roundStarted');
      };
    }
  }, [socket, activeGame]);


  // Fetch games data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.GAMES.GET_ALL_GAMES);
      setGames(response.data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  const activateGame = async (gameId) => {
    try {
      const response = await axiosInstance.patch(API_PATHS.GAMES.ACTIVATE_GAME(gameId));
      console.log('Game activated:', response.data);
      fetchData(); // Refresh games data
    } catch (error) {
      console.error('Error activating game:', error);
    }
  };

  const deactivateGame = async (gameId) => {
    try {
      const response = await axiosInstance.patch(API_PATHS.GAMES.DEACTIVATE_GAME(gameId));
      console.log('Game deactivated:', response.data);
      fetchData(); // Refresh games data
    } catch (error) {
      console.error('Error deactivating game:', error);
    }
  };

  const completeGame = async (gameId) => {
    try {
      const response = await axiosInstance.patch(API_PATHS.GAMES.COMPLETE_GAME(gameId));
      console.log('Game completed:', response.data);
      fetchData(); // Refresh games data
    } catch (error) {
      console.error('Error completing game:', error);
    }
  };

  // Score tabs - This should match the game types from your backend
  const scoreTabs = [
    { id: 'overall', name: 'Overall Scores' },
    { id: 'quiz-hunters', name: 'Quiz Hunters' },
    { id: 'code-crushers', name: 'Code Crushers' },
    { id: 'circuit-smashers', name: 'Circuit Smashers' },
    { id: 'route-seekers', name: 'Route Seekers' },
    { id: 'battle-breakers', name: 'Battle Breakers' },
  ];

  // Fetch team scores from backend
  useEffect(() => {
    const fetchTeamScores = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.ADMIN.GET_SCHOOL_SCORES);
        setTeamScores(response.data);
      } catch (error) {
        console.error('Error fetching team scores:', error);
      }
    };

    fetchTeamScores();
  }, []);

  // Get button style based on game status
  const getButtonStyle = (status) => {
    if (status === 'completed') return "bg-green-600";
    if (status === 'active') return "bg-sky-600";
    return "bg-purple-800";
  };

  // Handle game button click to show options modal
  const handleGameButtonClick = (game) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  // Handle modal action - makes API calls to backend
  const handleModalAction = async (action) => {
    if (action === 'cancel' || !selectedGame) {
      setShowModal(false);
      return;
    }

    try {
      console.log(`Action ${action} for game ${selectedGame.name}`);

      switch (action) {
        case 'activate':
          await activateGame(selectedGame._id);
          setTimeRemaining(selectedGame.allocateTime || 15); // Set timer for newly activated game
          break;
        case 'deactivate':
          await deactivateGame(selectedGame._id);
          if (activeGame && activeGame._id === selectedGame._id) {
            setTimeRemaining(0);
          }
          break;
        case 'complete':
          await completeGame(selectedGame._id);
          if (activeGame && activeGame._id === selectedGame._id) {
            setTimeRemaining(0);
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Error ${action} game:`, error);
    }

    setShowModal(false);
  };  
  
  // Handle stop game - makes API call to backend
  const handleStopGame = async () => {
    if (!activeGame) return;

    try {
      console.log(`Stopping game: ${activeGame.name}`);
      
      // For Circuit Smashers, emit stop round event
      if (activeGame.name === 'Circuit Smashers' && socket) {
        socket.emit('circuitSmashers-stopRound');
      }
      
      await deactivateGame(activeGame._id);
      setTimeRemaining(0);
    } catch (error) {
      console.error('Error stopping game:', error);
    }
  };

  // Handle start game timer
  const handleStartGameTimer = () => {
    if (!activeGame || !socket) return;

    if (activeGame.name === 'Circuit Smashers') {
      const allocatedTimeMinutes = activeGame.allocateTime || 30;
      const allocatedTimeSeconds = allocatedTimeMinutes * 60;

      console.log(`Starting Circuit Smashers timer: ${allocatedTimeMinutes} minutes`);
      
      socket.emit('circuitSmashers-startRound', {
        allocatedTime: allocatedTimeSeconds
      });
    }
  };

  // Handle pause game timer
  const handlePauseGameTimer = () => {
    if (!activeGame || !socket) return;

    if (activeGame.name === 'Circuit Smashers') {
      console.log('Pausing Circuit Smashers timer');
      socket.emit('circuitSmashers-pauseRound');
    }
  };

  // Handle resume game timer
  const handleResumeGameTimer = () => {
    if (!activeGame || !socket) return;

    if (activeGame.name === 'Circuit Smashers') {
      console.log('Resuming Circuit Smashers timer');
      socket.emit('circuitSmashers-resumeRound');
    }
  };

  const totalGameTime = (activeGame?.allocateTime || 20) * 60; // Convert minutes to seconds

  // Helper: format time as MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Request current state when Circuit Smashers becomes active
  useEffect(() => {
    if (activeGame && activeGame.status === 'active' && activeGame.name === 'Circuit Smashers' && socket) {
      console.log('Requesting Circuit Smashers current state');
      socket.emit('circuitSmashers-requestCurrentState');
    }
  }, [activeGame, socket]);

  return (
    <AdminLayout>

      {/* First rectangle - Games Control */}
      <div className="w-full mx-auto bg-white rounded-[15px] p-8 md:p-12 mb-10 shadow-md overflow-hidden">
        {/* Activate Games Section */}
        <div>
          <div className="justify-start text-black/80 text-2xl font-semibold font-['Inter']">Activate Games</div>
          <div className="w-full h-0 outline outline-offset-[-0.50px] outline-black/20 my-5"></div>

          {/* Game buttons */}
          <div className="flex gap-6 md:gap-8 mt-10 flex-wrap justify-center">
            {games.map((game) => (
              <button
                key={game._id}
                onClick={() => handleGameButtonClick(game)}
                className={`w-44 h-14 ${getButtonStyle(game.status)} rounded-[5px] shadow-[0px_0px_6px_1px_rgba(0,0,0,0.15)] border border-white text-white font-medium text-lg transition-all duration-200 hover:scale-105`}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ongoing Game Section */}
        <div className="mt-12">
          <div className="justify-start text-black/80 text-2xl font-semibold font-['Inter']">Ongoing Game</div>
          <div className="w-full h-0 outline outline-offset-[-0.50px] outline-black/20 my-5"></div>

          {activeGame && activeGame.status === 'active' ? (
            <div className="flex flex-col md:flex-row items-start md:items-center mt-8 bg-gray-50 p-6 rounded-xl">
              <div className="justify-start text-sky-600 text-3xl font-bold font-['Oxanium'] mb-6 md:mb-0 md:mr-8">
                {activeGame.name}
              </div>

              <div className="w-full md:flex-1 mt-2 md:mt-4">
                {/* Time remaining progress bar */}
                <div className="flex-1 bg-gray-200 h-5 rounded-full mb-3 mt-3">
                  <div
                    className="bg-purple-800 h-5 rounded-full transition-all duration-300 ease-in-out"
                    style={{
                      width: `${(timeRemaining / totalGameTime) * 100}%`
                    }}
                  ></div>
                </div>

                {/* Time remaining display */}
                <div className="text-gray-700 text-lg mt-2 mb-4 md:mb-0 text-center font-medium">
                  Time remaining: {formatTime(timeRemaining)}
                </div>
              </div>

              {/* Timer Control Buttons for Circuit Smashers */}
              {activeGame.name === 'Circuit Smashers' ? (
                <div className="flex flex-wrap gap-3 ml-0 md:ml-8">
                  {timeRemaining === 0 ? (
                    <button
                      className="bg-green-500 text-white px-6 py-2 text-sm rounded-lg hover:bg-green-600 font-medium transition-all duration-200 hover:scale-105 shadow-md"
                      onClick={handleStartGameTimer}
                    >
                      Start Timer
                    </button>
                  ) : (
                    <>
                      <button
                        className="bg-yellow-500 text-white px-6 py-2 text-sm rounded-lg hover:bg-yellow-600 font-medium transition-all duration-200 hover:scale-105 shadow-md"
                        onClick={handlePauseGameTimer}
                      >
                        Pause
                      </button>
                      <button
                        className="bg-blue-500 text-white px-6 py-2 text-sm rounded-lg hover:bg-blue-600 font-medium transition-all duration-200 hover:scale-105 shadow-md"
                        onClick={handleResumeGameTimer}
                      >
                        Resume
                      </button>
                    </>
                  )}
                  
                  <button
                    className="bg-red-500 text-white px-6 py-2 text-sm rounded-lg hover:bg-red-600 font-medium transition-all duration-200 hover:scale-105 shadow-md"
                    onClick={handleStopGame}
                  >
                    Stop Game
                  </button>
                </div>
              ) : (
                /* Default stop button for other games */
                <button
                  className="bg-red-500 text-white px-8 py-3 text-lg rounded-lg hover:bg-red-600 ml-0 md:ml-8 font-medium transition-all duration-200 hover:scale-105 shadow-md"
                  onClick={handleStopGame}
                >
                  Stop
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-8 bg-gray-50 p-10 rounded-xl">
              <p className="text-gray-600 text-xl mb-2 text-center">No active game at the moment</p>
              <p className="text-gray-500 text-base text-center">Activate a game from the section above</p>
            </div>
          )}
        </div>
      </div>

      {/* Second rectangle - Score Board */}
      <div className="w-full mx-auto h-[600px] bg-white rounded-[15px] p-8 md:p-10 shadow-md overflow-hidden">
        <div className="flex flex-col items-center w-full">
          <div className="text-black/80 text-3xl font-semibold font-['Inter'] mb-8 text-center">
            Score Board
          </div>

          {/* Score tabs */}
          <div className="w-full max-w-[90%] h-14 bg-white rounded-[38px] border border-zinc-500/40 flex items-center justify-around px-6 mb-10 overflow-x-auto custom-scrollbar shadow-sm">
            {scoreTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedScore(tab.id)}
                className={`px-6 py-2.5 rounded-full text-base font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 
                  ${selectedScore === tab.id
                    ? 'bg-purple-800 text-white shadow-md transform scale-105'
                    : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Team rankings */}
          <div className="w-full max-w-[90%] space-y-6 overflow-y-auto h-[420px] px-6 custom-scrollbar">
            {teamScores[selectedScore] && teamScores[selectedScore].map((team, index) => (
              <TeamRankItem key={index} index={index} team={team} />
            ))}
          </div>

          {/* Custom scrollbar styles */}
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 10px;
              margin: 5px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #5b21b6;
              border-radius: 10px;
              border: 2px solid #f1f1f1;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #4c1d95;
            }
          `}</style>
        </div>
      </div>

      {/* Game action modal */}
      <GameActionModal
        show={showModal}
        onClose={handleModalAction}
        game={selectedGame || {}}
      />
    </AdminLayout>
  );
}