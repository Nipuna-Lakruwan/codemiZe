import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const GameNode = ({ game, idx, visibleGames }) => {
  const navigate = useNavigate();

  // Floating animation variants for game icons
  const floatingAnimation = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Button animation variants
  const buttonAnimation = {
    rest: {
      scale: 1,
      boxShadow: "0px 0px 0px rgba(140, 20, 252, 0.3)"
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 15px rgba(140, 20, 252, 0.5)"
    },
    tap: {
      scale: 0.95,
      boxShadow: "0px 0px 0px rgba(140, 20, 252, 0.3)"
    },
    disabled: {
      filter: "grayscale(1) opacity(0.6) brightness(0.7)",
      scale: 1
    }
  };

  return (
    <AnimatePresence key={game.id}>
      {visibleGames.includes(idx) && (
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: game.pos.left,
            top: game.pos.top,
          }}
        >
          <div className="relative flex flex-col items-center">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.5, x: -80 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 0,
                transition: {
                  duration: 0.6,
                  ease: "easeOut",
                }
              }}
              whileHover={game.isAvailable ? { scale: 1.08 } : {}}
            >
              {/* Triangle gradient with game icon */}
              <div
                className="absolute left-1/2 transform -translate-x-1/2 z-30 flex items-center justify-center"
                style={{
                  top: '-160px',
                  width: '500px',
                  height: '16px',
                  opacity: game.isAvailable ? 1 : 0.5
                }}
              >
                <motion.img
                  src="/Polygon 1.png"
                  alt="Triangle"
                  className="w-full h-full object-contain"
                  style={{
                    width: '500px',
                    height: '500px',
                    filter: game.isCompleted
                      ? 'drop-shadow(0 0 10px rgba(34, 197, 94, 0.6))'
                      : game.isAvailable
                        ? 'drop-shadow(0 0 10px rgba(140, 20, 252, 0.6))'
                        : 'brightness(0.5) saturate(0.3)',
                  }}
                  initial={{ opacity: 0, rotateZ: 15 }}
                  animate={{
                    opacity: 1,
                    rotateZ: 0,
                    transition: {
                      duration: 0.8,
                      delay: 0.2
                    }
                  }}
                />

                {/* Game icon with floating animation */}
                <motion.img
                  src={game.icon}
                  alt={game.title}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-contain z-40"
                  style={{
                    width: '300px',
                    height: '300px',
                    filter: game.isAvailable
                      ? 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))'
                      : 'grayscale(1) brightness(0.7)',
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={[
                    {
                      opacity: 1,
                      scale: 1,
                      transition: {
                        duration: 0.8,
                        delay: 0.4,
                        ease: "easeOut"
                      }
                    },
                    game.isAvailable ? "animate" : {}
                  ]}
                  variants={floatingAnimation}
                />
              </div>

              <GameButton
                game={game}
                buttonAnimation={buttonAnimation}
                navigate={navigate}
              />
            </motion.div>

            <GameTitle game={game} />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

const GameButton = ({ game, buttonAnimation, navigate }) => {
  // Map game titles to their routes
  const gameRoutes = {
    'Quiz Hunters': '/student/quiz-hunters',
    'Code Crushers': '/student/code-crushers',
    'Circuit Smashers': '/student/circuit-smashers',
    'Route Seekers': '/student/route-seekers',
    'Battle Breakers': '/student/battle-breakers',
  };

  return (
    <div
      className={`relative w-32 h-32 ${game.isAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={() => {
        if (game.isAvailable && gameRoutes[game.title]) {
          navigate(gameRoutes[game.title]);
        }
      }}
    >
      {/* Invisible click area that covers the entire button */}
      <div
        className="absolute inset-0 z-30 rounded-full"
        style={{
          background: 'transparent',
          cursor: game.isAvailable ? 'pointer' : 'not-allowed'
        }}
      ></div>

      {/* Button visual with animation */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center bg-transparent border-none focus:outline-none"
        initial="rest"
        whileHover={game.isAvailable ? "hover" : "disabled"}
        whileTap={game.isAvailable ? "tap" : "disabled"}
        animate={game.isAvailable ? "rest" : "disabled"}
        variants={buttonAnimation}
      >
        <motion.img
          src="/btn.svg"
          alt="Game Button"
          className="w-full h-full object-contain"
          style={{
            filter: game.isCompleted
              ? 'drop-shadow(0 0 12px rgba(34, 197, 94, 0.7))'
              : game.isAvailable
                ? 'drop-shadow(0 0 10px rgba(140, 20, 252, 0.5))'
                : 'grayscale(1) opacity(0.6) brightness(0.7)',
            pointerEvents: 'none' // Make sure image doesn't capture clicks
          }}
          initial={{ opacity: 0, rotateY: 90 }}
          animate={{
            opacity: 1,
            rotateY: 0,
            transition: {
              duration: 0.6,
              delay: 0.3,
              ease: "easeOut"
            }
          }}
        />
      </motion.div>

      {/* Locked indicator only for unavailable games */}
      {!game.isAvailable && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-40"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.8,
              duration: 0.4
            }
          }}
          style={{ pointerEvents: 'none' }} // Prevent lock icon from blocking clicks
        >
          <div className="bg-black/60 backdrop-blur-sm w-12 h-12 rounded-full flex items-center justify-center border border-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
};

const GameTitle = ({ game }) => {
  return (
    <motion.div
      className={`mt-4 text-white font-semibold text-center px-3 py-2 rounded-md backdrop-blur-sm ${game.isCompleted
        ? 'bg-green-900/40 border border-green-500/30'
        : game.isAvailable
          ? 'bg-purple-900/40 border border-purple-500/30'
          : 'bg-black/40 border border-gray-500/20'
        }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.4,
          delay: 0.5
        }
      }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-xl">{game.title}</div>

      {/* Status labels with improved styling */}
      {!game.isAvailable && (
        <div className="text-xs mt-1 text-gray-300 bg-black/40 rounded-full px-2 py-1 inline-block">
          <span className="mr-1">🔒</span> Coming Soon
        </div>
      )}
      {game.isAvailable && !game.isCompleted && (
        <div className="text-xs mt-1 text-blue-300 bg-blue-900/40 rounded-full px-2 py-1 inline-block">
          <span className="mr-1">🎮</span> Available Now
        </div>
      )}
      {game.isCompleted && (
        <div className="text-xs mt-1 text-green-300 bg-green-900/40 rounded-full px-2 py-1 inline-block">
          <span className="mr-1">✓</span> Completed
        </div>
      )}
    </motion.div>
  );
};

export default GameNode;
