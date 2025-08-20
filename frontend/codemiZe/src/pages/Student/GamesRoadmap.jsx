import React, { useRef, useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';


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
    icon: '/Quiz Hunters 2.png',
    pos: { left: '15%', top: '65%' },
    status: 'inactive',
  },
  {
    id: 2,
    title: 'Code Crushers',
    icon: '/CODE CRUSHERS.png',
    pos: { left: '25%', top: '35%' },
    status: 'active',
  },
  {
    id: 3,
    title: 'Circuit Smashers',
    icon: '/circuit smashes.png',
    pos: { left: '50%', top: '75%' },
    status: 'available',
  },
  {
    id: 4,
    title: 'Route Seekers',
    icon: '/circuit smashes.png',
    pos: { left: '68%', top: '40%' },
    status: 'available',
  },
  {
    id: 5,
    title: 'Battle Breakers',
    icon: '/Battle Breakers.png',
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
      start: { x: getX('15'), y: getY('65') },
      end: { x: getX('25'), y: getY('35') },
      control: { x: getX('20'), y: getY('50') },
      isAvailable: true, // This path is available
      useLineImage: true // Use custom line image for this path
    },
    {
      // Code Crushers to Circuit Smashers
      start: { x: getX('25'), y: getY('35') },
      end: { x: getX('50'), y: getY('75') },
      control: { x: getX('37'), y: getY('55') },
      isAvailable: false // This path is not available yet
    },
    {
      // Circuit Smashers to Route Seekers
      start: { x: getX('50'), y: getY('75') },
      end: { x: getX('68'), y: getY('40') },
      control: { x: getX('60'), y: getY('65') },
      isAvailable: false, // This path is not available yet
      useLineImage: true // Use custom line image for this path
    },
    {
      // Route Seekers to Battle Breakers
      start: { x: getX('68'), y: getY('40') },
      end: { x: getX('85'), y: getY('70') },
      control: { x: getX('77'), y: getY('50') },
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
  const navigate = useNavigate();

  // Define line image configurations
  const [lineImages, setLineImages] = useState([
    {
      pathIndex: 0, // First path (Quiz Hunters to Code Crushers)
      position: { x: 400, y: 600 }, // Repositioned for better visibility
      rotation: 0, // Custom rotation angle (degrees) - 90 degrees for clear visibility
      scale: { width: 250, height: 300 }, // Custom size - equal dimensions for clearer rotation visibility
      imageName: 'line1' // Using line1.png image
    },
    {
      pathIndex: 3, // Second path (Code Crushers to Circuit Smashers)
      position: { x: 1470, y: 660 }, // Strategic position for this path
      rotation: -3, // Custom rotation angle (degrees)
      scale: { width: 400, height: 600 }, // Custom size for this image
      imageName: 'line5' // Using line5.png image
    },
    {
      pathIndex: 1, // Third path (Circuit Smashers to Route Seekers)
      position: { x: 740, y: 670 }, // Repositioned for better visibility
      rotation: 190, // Custom rotation angle (degrees) - 180 degrees for clear visibility
      scale: { width: 600, height: 700 }, // Custom size - equal dimensions for clearer rotation visibility
      imageName: 'line2' // Using line2.png image
    },
    {
      pathIndex: 2, // Fourth path (Route Seekers to Battle Breakers)
      position: { x: 1100, y: 700 }, // Explicit position for better visibility
      rotation: 0, // Custom rotation angle (degrees) - 270 degrees for clear visibility
      scale: { width: 300, height: 500 }, // Custom size - equal dimensions for clearer rotation visibility
      imageName: 'line4' // Using line4.png image
    },
  ]);

  useEffect(() => {
    if (socket) {
      // Listen for game state updates
      socket.on('gameStateUpdate', (updateData) => {
        //console.log('Received game state update:', updateData);
        updateGameState(updateData);
      });

      socket.on('finalists', () => {
        console.log('Finalists event received');
        navigate('/student/winners');
      });

      // Clean up the event listeners when component unmounts
      return () => {
        socket.off("gameStateUpdate");
        socket.off("finalists");
      };
    }
  }, [socket]);

  // Function to update game state based on socket data
  const updateGameState = (updateData) => {
    const { gameId, newStatus } = updateData;

    setGames(prevGames => {
      // If activating a game, deactivate any other active game
      if (newStatus === 'active') {
        return prevGames.map(game => {
          if (game._id === gameId) {
            return {
              ...game,
              status: 'active',
              isCompleted: false,
              isAvailable: true,
              isInactive: false,
            };
          } else if (game.status === 'active') {
            // Deactivate previously active game
            return {
              ...game,
              status: 'inactive',
              isCompleted: false,
              isAvailable: false,
              isInactive: true,
            };
          }
          return game;
        });
      } else {
        // For other status changes, just update the target game
        return prevGames.map(game => {
          if (game._id === gameId) {
            return {
              ...game,
              status: newStatus,
              isCompleted: newStatus === 'completed',
              isAvailable: newStatus === 'active',
              isInactive: newStatus === 'inactive',
            };
          }
          return game;
        });
      }
    });

    // Trigger animation for the changed game node only
    if (initialAnimationComplete) {
      setAnimatedGameIds(prev => new Set([...prev, gameId]));
      // Remove the animation trigger after a short delay to reset for future changes
      setTimeout(() => {
        setAnimatedGameIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(gameId);
          return newSet;
        });
      }, 1000);
    }

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
            // Make sure position values are used properly as percentages
            pos: {
              left: mockGame.pos.left,
              top: mockGame.pos.top,
            },
            // Map status to boolean properties for GameNode component
            isCompleted: gameStatus === 'completed',
            isAvailable: gameStatus === 'active',
            isInactive: gameStatus === 'inactive',
          };
        });

        setGames(mergedGames);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    fetchGames();
  }, []);

  // Animation states for sequential reveal
  const [visibleGames, setVisibleGames] = useState([]);
  const [visiblePaths, setVisiblePaths] = useState([]);
  const [initialAnimationComplete, setInitialAnimationComplete] = useState(false);
  const [animatedGameIds, setAnimatedGameIds] = useState(new Set());

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

        // Generate updated paths
        const newPaths = generatePaths(width, height);
        setPaths(newPaths);

        // Only update positions for items that have null coordinates
        setLineImages(prev => prev.map(img => {
          const path = newPaths[img.pathIndex];
          if (!path) return img;

          // If both x and y have valid values, preserve the position exactly
          if (img.position &&
            img.position.x !== null &&
            img.position.x !== undefined &&
            img.position.y !== null &&
            img.position.y !== undefined) {
            return img;
          }

          // Otherwise, calculate any missing coordinates
          const newPosition = {
            x: img.position?.x !== null && img.position?.x !== undefined ?
              img.position.x : (path.start.x + path.end.x) / 2,
            y: img.position?.y !== null && img.position?.y !== undefined ?
              img.position.y : (path.start.y + path.end.y) / 2
          };

          return {
            ...img,
            position: newPosition
          };
        }));
      }
    }

    // Initial update
    updateSize();

    // Add event listener
    window.addEventListener('resize', updateSize);

    // Cleanup
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initial sequential animation effect - only runs once when games are first loaded
  useEffect(() => {
    if (games.length === 0 || initialAnimationComplete) return;

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

      // Mark initial animation as complete
      setInitialAnimationComplete(true);
    };

    animateSequence();
  }, [games.length, initialAnimationComplete]); // Only depend on games.length, not the entire games array

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

      {/* SVG paths with color-coded availability and custom line images */}
      <PathMap
        paths={paths}
        visiblePaths={visiblePaths}
        containerSize={containerSize}
        themeColorLight={themeColorLight}
        lineImages={lineImages}
      />

      {/* Game stations */}
      <div className="relative w-full h-full z-20">
        {games.map((game, idx) => (
          <GameNode
            key={game._id}
            game={game}
            idx={idx}
            visibleGames={visibleGames}
            isAnimating={animatedGameIds.has(game._id)}
          />
        ))}
      </div>
    </div>
  );
}