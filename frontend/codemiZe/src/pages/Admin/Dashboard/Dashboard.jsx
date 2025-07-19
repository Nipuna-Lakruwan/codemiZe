import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../../components/Admin/AdminLayout';
import TeamRankItem from '../../../components/Admin/TeamRankItem';
import { use } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';

// Modal component for button actions
const GameActionModal = ({ show, onClose, game }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-lg p-6 w-[400px] shadow-xl"
      >
        <h3 className="text-xl font-bold mb-4">{game.name}</h3>
        <div className="mb-4">
          <p>Current status: <span className="font-medium">{game.status}</span></p>
          <p className="text-sm text-gray-600 mt-2">
            Select an action to change the game status.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            className="py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => onClose('activate')}
          >
            Activate
          </button>
          <button
            className="py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={() => onClose('deactivate')}
          >
            Deactivate
          </button>
          <button
            className="py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => onClose('reset')}
          >
            Reset
          </button>
          <button
            className="py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={() => onClose('cancel')}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function Dashboard() {
  // State
  const [selectedScore, setSelectedScore] = useState('overall');
  const [selectedGame, setSelectedGame] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(45); // in minutes
  const [games, setGames] = useState([]);
  const [activeGame, setActiveGame] = useState();

  /**
   * BACKEND INTEGRATION POINT:
   * 
   * The following data should be fetched from the API:
   * 1. List of games with their current status
   * 2. Currently active game (if any) with remaining time
   * 3. Game scores for each team
   * 
   * Suggested API endpoints:
   * - GET /api/games - List all games with status
   * - GET /api/games/active - Get currently active game with timer
   * - GET /api/scores - Get all team scores (can be filtered by game)
   * - POST /api/games/:id/activate - Activate a specific game
   * - POST /api/games/:id/deactivate - Deactivate a specific game
   * - POST /api/games/:id/reset - Reset a specific game
   */

  // Fetch games data from backend
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.GAMES.GET_ALL_GAMES);
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      // Fetch active game if any
      try {
        const activeResponse = await axiosInstance.get(API_PATHS.GAMES.GET_ACTIVE_GAME);
        setActiveGame(activeResponse.data);
      } catch (error) {
        console.error('Error fetching active game:', error);
      }
    };
  
  const activateGame = async () => {
    try {
      const response = await axiosInstance.patch(API_PATHS.GAMES.ACTIVATE_GAME(selectedGame._id));
      console.log('Game activated:', response.data);
      fetchData();
    } catch (error) {
      console.error('Error activating game:', error);
    }
  }

  // Mock data is now managed in state  // Score tabs - This should match the game types from your backend
  const scoreTabs = [
    { id: 'overall', name: 'Overall Scores' },
    { id: 'quiz-hunters', name: 'Quiz Hunters' },
    { id: 'code-crushers', name: 'Code Crushers' },
    { id: 'circuit-smashers', name: 'Circuit Smashers' },
    { id: 'route-seekers', name: 'Route Seekers' },
    { id: 'battle-breakers', name: 'Battle Breakers' },
  ];

  /**
   * BACKEND INTEGRATION POINT:
   * 
   * Team scores should be fetched from the backend.
   * The structure should match what's shown below, with:
   * - team name
   * - logo path
   * - city
   * - score
   * 
   * The API should allow filtering by game type.
   * Suggested endpoint: GET /api/scores?game=game_id
   */

  // Mock Teams data with scores
  const teamScores = {
    'overall': [
      { name: "Sri Sangabodhi Central College", logo: "/code crushers logo 1.png", city: "Dankotuwa", score: 450 },
      { name: "Maris Stella College", logo: "/circuit samshers logo 1.png", city: "Negombo", score: 420 },
      { name: "St. Joseph's College", logo: "/quiz_hunters_logo-removebg 1.png", city: "Colombo", score: 380 },
      { name: "Royal College", logo: "/code crushers logo 1.png", city: "Colombo", score: 350 },
      { name: "Ananda College", logo: "/circuit samshers logo 1.png", city: "Colombo", score: 330 }
    ],
    'quiz-hunters': [
      { name: "St. Joseph's College", logo: "/quiz_hunters_logo-removebg 1.png", city: "Colombo", score: 95 },
      { name: "Sri Sangabodhi Central College", logo: "/code crushers logo 1.png", city: "Dankotuwa", score: 90 },
      { name: "Royal College", logo: "/code crushers logo 1.png", city: "Colombo", score: 85 },
      { name: "Maris Stella College", logo: "/circuit samshers logo 1.png", city: "Negombo", score: 80 },
      { name: "Ananda College", logo: "/circuit samshers logo 1.png", city: "Colombo", score: 75 }
    ],
    'code-crushers': [
      { name: "Sri Sangabodhi Central College", logo: "/code crushers logo 1.png", city: "Dankotuwa", score: 98 },
      { name: "Maris Stella College", logo: "/circuit samshers logo 1.png", city: "Negombo", score: 90 },
      { name: "Royal College", logo: "/code crushers logo 1.png", city: "Colombo", score: 88 },
      { name: "St. Joseph's College", logo: "/quiz_hunters_logo-removebg 1.png", city: "Colombo", score: 85 },
      { name: "Ananda College", logo: "/circuit samshers logo 1.png", city: "Colombo", score: 80 }
    ],
    'circuit-smashers': [
      { name: "Maris Stella College", logo: "/circuit samshers logo 1.png", city: "Negombo", score: 95 },
      { name: "Sri Sangabodhi Central College", logo: "/code crushers logo 1.png", city: "Dankotuwa", score: 90 },
      { name: "Ananda College", logo: "/circuit samshers logo 1.png", city: "Colombo", score: 85 },
      { name: "Royal College", logo: "/code crushers logo 1.png", city: "Colombo", score: 82 },
      { name: "St. Joseph's College", logo: "/quiz_hunters_logo-removebg 1.png", city: "Colombo", score: 78 }
    ],
    'route-seekers': [
      { name: "Sri Sangabodhi Central College", logo: "/code crushers logo 1.png", city: "Dankotuwa", score: 92 },
      { name: "Royal College", logo: "/code crushers logo 1.png", city: "Colombo", score: 90 },
      { name: "St. Joseph's College", logo: "/quiz_hunters_logo-removebg 1.png", city: "Colombo", score: 85 },
      { name: "Maris Stella College", logo: "/circuit samshers logo 1.png", city: "Negombo", score: 80 },
      { name: "Ananda College", logo: "/circuit samshers logo 1.png", city: "Colombo", score: 75 }
    ],
    'battle-breakers': [
      { name: "St. Joseph's College", logo: "/quiz_hunters_logo-removebg 1.png", city: "Colombo", score: 95 },
      { name: "Maris Stella College", logo: "/circuit samshers logo 1.png", city: "Negombo", score: 90 },
      { name: "Sri Sangabodhi Central College", logo: "/code crushers logo 1.png", city: "Dankotuwa", score: 85 },
      { name: "Ananda College", logo: "/circuit samshers logo 1.png", city: "Colombo", score: 80 },
      { name: "Royal College", logo: "/code crushers logo 1.png", city: "Colombo", score: 75 }
    ],
  };

  // Get button style based on game status
  const getButtonStyle = (game) => {
    if (game.isCompleted) return "bg-green-600";
    if (game.isActive) return "bg-sky-600";
    return "bg-purple-800";
  };
  /**
   * Event handlers for game management
   * 
   * BACKEND INTEGRATION POINTS:
   * These functions should make API calls to update game status
   */

  // Handle game button click to show options modal
  const handleGameButtonClick = (game) => {
    setSelectedGame(game);
    setShowModal(true);
  };  // Handle modal action - updates state and would make API calls to backend

  const handleModalAction = (action) => {
    if (action !== 'cancel') {
      console.log(`Action ${action} for game ${selectedGame.name}`);

      // Frontend implementation with proper state updates
      const updatedGames = [...games];
      const gameIndex = updatedGames.findIndex(g => g._id === selectedGame._id);

      if (gameIndex !== -1) {
        switch (action) {
          case 'activate':
            // First deactivate any currently active game
            const activeGameIndex = updatedGames.findIndex(g => g.status === 'active');
            if (activeGameIndex !== -1) {
              updatedGames[activeGameIndex] = {
                ...updatedGames[activeGameIndex],
                status: 'not-active'
              };
            }

            // Then activate the selected game
            updatedGames[gameIndex] = {
              ...updatedGames[gameIndex],
              status: 'active'
            };

            // Set the active game for the ongoing game section
            setActiveGame(updatedGames[gameIndex]);
            activateGame();

            // Reset the timer for the newly activated game
            setTimeRemaining(60); // 60 minutes for a new game
            break;

          case 'deactivate':
            updatedGames[gameIndex] = {
              ...updatedGames[gameIndex],
              status: 'not-active'
            };

            // Clear active game if we're deactivating it
            if (activeGame && activeGame._id === selectedGame._id) {
              setActiveGame(null);
            }
            break;

          case 'reset':
            updatedGames[gameIndex] = {
              ...updatedGames[gameIndex],
              status: 'not-active'
            };

            // Clear active game if we're resetting it
            if (activeGame && activeGame._id === selectedGame._id) {
              setActiveGame(null);
            }
            break;

          default:
            break;
        }

        // Update the games state
        setGames(updatedGames);
      }

      /**
       * Make API call based on action:
       * - 'activate': POST /api/games/${selectedGame.id}/activate
       * - 'deactivate': POST /api/games/${selectedGame.id}/deactivate
       * - 'reset': POST /api/games/${selectedGame.id}/reset
       * 
       * After successful response, update local state or refetch games data
       */

      // Example API call (to be implemented)
      // const endpoint = `/api/games/${selectedGame.id}/${action}`;
      // fetch(endpoint, { method: 'POST' })
      //   .then(response => response.json())
      //   .then(data => {
      //     // Update game status or refetch games
      //   })
      //   .catch(error => console.error(`Error ${action} game:`, error));
    }
    setShowModal(false);
  };  // Handle stop game - updates state and would make API call to backend

  const handleStopGame = () => {
    if (!activeGame) return;

    console.log(`Stopping game: ${activeGame.name}`);

    // Frontend implementation with proper state updates
    const updatedGames = [...games];
    const activeGameIndex = updatedGames.findIndex(g => g.id === activeGame.id);

    if (activeGameIndex !== -1) {
      // Change active game to completed
      updatedGames[activeGameIndex] = {
        ...updatedGames[activeGameIndex],
        status: 'completed'
      };

      // Update the games state
      setGames(updatedGames);

      // Update time remaining to show game is complete
      setTimeRemaining(0);

      // Mark the game as completed in active game state
      setActiveGame({
        ...activeGame,
        status: 'completed'
      });
    }

    /**
     * Make API call to stop the active game:
     * POST /api/games/active/stop
     * 
     * After successful response, update local state or refetch games data
     */

    // Example API call (to be implemented)
    // fetch('/api/games/active/stop', { method: 'POST' })
    //   .then(response => response.json())
    //   .then(data => {
    //     // Update game status
    //   })
    //   .catch(error => console.error('Error stopping game:', error));
  };

  // Timer effect - simulates countdown for active game
  useEffect(() => {
    let timerId;

    // Only countdown if we have an active game and time remaining
    if (activeGame && activeGame.status === 'active' && timeRemaining > 0) {
      timerId = setInterval(() => {
        setTimeRemaining(prev => {
          // Stop timer when we reach 0
          if (prev <= 1) {
            clearInterval(timerId);
            return 0;
          }
          return prev - 1;
        });
      }, 60000); // Update every minute (or use 1000 to update every second for testing)
    }

    // Cleanup timer when component unmounts or dependencies change
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [activeGame, timeRemaining]);

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
                className={`w-44 h-14 ${getButtonStyle(game)} rounded-[5px] shadow-[0px_0px_6px_1px_rgba(0,0,0,0.15)] border border-white text-white font-medium text-lg transition-all duration-200 hover:scale-105`}
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

          {activeGame && activeGame.isActive ? (
            <div className="flex flex-col md:flex-row items-start md:items-center mt-8 bg-gray-50 p-6 rounded-xl">
              <div className="justify-start text-sky-600 text-3xl font-bold font-['Oxanium'] mb-6 md:mb-0 md:mr-8">
                {activeGame.name}
              </div>

              <div className="w-full md:flex-1 mt-2 md:mt-4">
                {/* Time remaining progress bar */}
                <div className="flex-1 bg-gray-200 h-5 rounded-full mb-3 mt-3">
                  <div
                    className="bg-purple-800 h-5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${(timeRemaining / 60) * 100}%` }}
                  ></div>
                </div>

                {/* Time remaining display */}
                <div className="text-gray-700 text-lg mt-2 mb-4 md:mb-0 text-center font-medium">
                  Time remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')} minutes
                </div>
              </div>

              {/* Stop button */}
              <button
                className="bg-red-500 text-white px-8 py-3 text-lg rounded-lg hover:bg-red-600 ml-0 md:ml-8 font-medium transition-all duration-200 hover:scale-105 shadow-md"
                onClick={handleStopGame}
              >
                Stop
              </button>
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
            {teamScores[selectedScore].map((team, index) => (
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
