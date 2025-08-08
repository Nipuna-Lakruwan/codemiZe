import React, { useRef, useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';

// Import new components
import GameNode from '../../components/GamesRoadMap/GameNode';
import PathMap from '../../components/GamesRoadMap/PathMap';
import Header from '../../components/GamesRoadMap/Header';
import CentralLogo from '../../components/GamesRoadMap/CentralLogo';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { imagePath } from '../../utils/helper';
import { SocketContext } from '../../context/SocketContext';

// Game data with positions and status (status: 'completed', 'active', 'inactive')
const mockGames = [
  {
    id: 1,
    title: 'Quiz Hunters',
    icon: '/quiz_hunters_logo-removebg 1.png',
    pos: { left: '15%', top: '75%' },
    status: 'inactive',
  },
  {
    id: 2,
    title: 'Code Crushers',
    icon: '/code crushers logo 1.png',
    pos: { left: '32%', top: '40%' },
    status: 'active',
  },
  {
    id: 3,
    title: 'Circuit Smashers',
    icon: '/circuit samshers logo 1.png',
    pos: { left: '50%', top: '75%' },
    status: 'available',
  },
  {
    id: 4,
    title: 'Route Seekers',
    icon: '/circuit samshers logo 1.png',
    pos: { left: '68%', top: '40%' },
    status: 'available',
  },
  {
    id: 5,
    title: 'Battle Breakers',
    icon: '/Battle breakers logo 1.png',
    pos: { left: '85%', top: '70%' },
    status: 'available',
  },
];

// Define path configurations with numeric values instead of percentages
const generatePaths = (width, height) => {
  // Convert percentage to actual pixel positions
  const getX = (percent) => (parseFloat(percent) / 100) * width;
  const getY = (percent) => (parseFloat(percent) / 100) * height;

  return [
    {
      // Quiz Hunters to Code Crushers
      start: { x: getX('15'), y: getY('80') },
      end: { x: getX('32'), y: getY('45') },
      control: { x: getX('20'), y: getY('65') },
      isAvailable: true // This path is available
    },
    {
      // Code Crushers to Circuit Smashers
      start: { x: getX('32'), y: getY('45') },
      end: { x: getX('50'), y: getY('80') },
      control: { x: getX('41'), y: getY('60') },
      isAvailable: false // This path is not available yet
    },
    {
      // Circuit Smashers to Route Seekers
      start: { x: getX('50'), y: getY('80') },
      end: { x: getX('68'), y: getY('45') },
      control: { x: getX('65'), y: getY('85') },
      isAvailable: false // This path is not available yet
    },
    {
      // Route Seekers to Battle Breakers
      start: { x: getX('68'), y: getY('45') },
      end: { x: getX('85'), y: getY('76') },
      control: { x: getX('80'), y: getY('50') },
      isAvailable: false // This path is not available yet
    },
  ];
};

export default function GamesRoadmap() {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 1000, height: 600 });
  const [paths, setPaths] = useState(generatePaths(1000, 600));
  const [games, setGames] = useState([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (socket) {
      // Listen for game state updates
      socket.on('gameStateUpdate', (updateData) => {
        console.log('Received game state update:', updateData);
        updateGameState(updateData);
      });

      // Clean up the event listeners when component unmounts
      return () => {
        socket.off("gameStateUpdate");
      };
    }
  }, [socket]);

    // Function to update game state based on socket data
  const updateGameState = (updateData) => {
    const { gameId, newStatus } = updateData;

    setGames(prevGames => {
      return prevGames.map(game => {
        const isTargetGame = game._id === gameId;
        
        if (isTargetGame) {
          return {
            ...game,
            status: newStatus,
            // Update boolean properties for GameNode component
            isCompleted: newStatus === 'completed',
            isAvailable: newStatus === 'active',
            isInactive: newStatus === 'inactive',
          };
        }
        return game;
      });
    });

    // Update path availability based on new game states
    //updatePathAvailability();
  };

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.GAMES.GET_ALL_GAMES);
        const backendGames = response.data;


        // Merge with mock data and compute status
        const mergedGames = mockGames.map((mockGame) => {
          const backendGame = backendGames.find(bg => bg.name === mockGame.title);
          const gameStatus = backendGame?.status || mockGame.status;

          return {
            ...mockGame,
            _id: backendGame?._id || null,
            icon: imagePath(backendGame?.icon?.url) || mockGame.icon,
            allocateTime: backendGame?.allocateTime || 0,
            status: gameStatus,
            // Map status to boolean properties for GameNode component
            isCompleted: gameStatus === 'completed',
            isAvailable: gameStatus === 'active',
            isInactive: gameStatus === 'inactive',
          };
        });

        setGames(mergedGames);
        console.log('Fetched games:', mergedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  // Animation states for sequential reveal
  const [visibleGames, setVisibleGames] = useState([]);
  const [visiblePaths, setVisiblePaths] = useState([]);

  // Theme color for available items
  const themeColor = 'rgba(62, 5, 128, 1)';
  const themeColorLight = 'rgba(140, 20, 252, 0.8)';
  const completedColor = 'rgba(34, 197, 94, 0.9)'; // Green color for completed
  const availableColor = 'rgba(59, 130, 246, 0.9)'; // Blue color for available

  // Update container size and regenerate paths when window resizes
  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        setContainerSize({ width, height });
        setPaths(generatePaths(width, height));
      }
    }

    // Initial update
    updateSize();

    // Add event listener
    window.addEventListener('resize', updateSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Sequential animation effect - Updated for left to right flow
  useEffect(() => {
    if (games.length === 0) return;

    const animateSequence = async () => {
      // Reset animations if needed
      setVisibleGames([]);
      setVisiblePaths([]);

      // Show first game with left to right entrance
      setVisibleGames([0]);
      await new Promise(resolve => setTimeout(resolve, 600));

      // Animate each game and path sequentially from left to right
      for (let i = 0; i < games.length - 1; i++) {
        // Show path to next game
        setVisiblePaths(prev => [...prev, i]);
        await new Promise(resolve => setTimeout(resolve, 500));

        // Show next game
        setVisibleGames(prev => [...prev, i + 1]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };

    animateSequence();
  }, [games]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen min-h-screen bg-cover bg-center bg-no-repeat bg-fixed overflow-hidden"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Dark overlay layer */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Central logo */}
      <CentralLogo />

      {/* Header */}
      <Header />

      {/* SVG paths with color-coded availability */}
      <PathMap
        paths={paths}
        visiblePaths={visiblePaths}
        containerSize={containerSize}
        themeColorLight={themeColorLight}
      />

      {/* Game stations */}
      <div className="relative w-full h-full z-20">
        {games.map((game, idx) => (
          <GameNode
            key={game._id}
            game={game}
            idx={idx}
            visibleGames={visibleGames}
          />
        ))}
      </div>
    </div>
  );
}