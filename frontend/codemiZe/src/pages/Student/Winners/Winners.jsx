import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GameLayout from '../GameLayout/GameLayout';

const Confetti = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create confetti particles
    const newParticles = [];
    const colors = ['#ff577f', '#ff884b', '#ffd384', '#9f5eff', '#a2d2ff'];

    for (let i = 0; i < 100; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 80, // Start above the screen
        size: 5 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        speed: 1 + Math.random() * 3
      });
    }

    setParticles(newParticles);

    // Animation loop
    const interval = setInterval(() => {
      setParticles(prevParticles =>
        prevParticles.map(p => ({
          ...p,
          y: p.y + p.speed,
          rotation: p.rotation + 1,
          // Reset particles when they go off screen
          ...(p.y > 120 ? {
            y: -20 - Math.random() * 80,
            x: Math.random() * 100
          } : {})
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-sm"
          style={{
            left: `${particle.x}vw`,
            top: `${particle.y}vh`,
            width: `${particle.size}px`,
            height: `${particle.size * 0.8}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            opacity: 0.8
          }}
        />
      ))}
    </div>
  );
};

export default function Winners() {
  const navigate = useNavigate();

  // Function to navigate back to the roadmap
  const goBackToRoadmap = () => {
    navigate('/student/games-roadmap');
  };

  // Sample data for winners - in a real app this would come from an API or props
  const winners = [
    {
      teamName: "Nipuna ge team eka",
      logoPath1: "/scl1.png",
      marks: 450,
      position: 1,
      members: ["John D.", "Jane S.", "Alex K."]
    },
    {
      teamName: "Nipuna ge team eka 2",
      logoPath2: "/scl2.png",
      marks: 420,
      position: 2,
      members: ["Michael T.", "Sarah L.", "David R."]
    }
  ];

  return (
    <GameLayout>
      {/* Confetti animation */}
      <Confetti />

      <div className="flex flex-col items-center justify-start pt-16 min-h-screen">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          onClick={goBackToRoadmap}
          className="absolute top-8 left-8 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg flex items-center space-x-2 transition-all z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Back to Roadmap</span>
        </motion.button>

        {/* Main heading - centered at the top */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 mt-8 flex justify-center w-full"
        >
          <img
            src="/codemize-logo.png"
            alt="CodemiZe Winners"
            className="h-50 w-auto"
          />
        </motion.div>

        {/* Subheading - centered below main heading */}
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 flex justify-center w-full"
        >
          <div className="text-orange-200 text-9xl font-normal font-['Jersey_25'] text-center">
            Winners
          </div>
        </motion.div>

        {/* Winners container - side by side layout */}
        <div className="flex justify-center items-start gap-20 w-full px-8">
          {winners.map((winner, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + (index * 0.2) }}
              className="flex flex-col items-center"
            >
              {/* Stage container for each winner */}
              <div className="flex flex-col items-center relative">
                {/* Stage image */}
                <div className="relative w-200 flex flex-col items-center">
                  <img
                    src="/stage.png"
                    alt="Winner Stage"
                    className="w-200 h-100"
                  />

                  {/* Scale image */}
                  <motion.div
                    className="absolute bottom-[50%]"
                    animate={{
                      rotateZ: [0, index === 0 ? 3 : -3, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.5
                    }}
                  >
                    <img
                      src={index === 0 ? "/scl1.png" : "/scl2.png"}
                      alt="Scale"
                      className="w-60 object-contain"
                    />
                  </motion.div>

                  {/* Marks display with special styling - positioned within the stage */}
                  <motion.div
                    className="absolute bottom-[30%] justify-start text-sky-400 text-6xl font-normal font-['Jersey_25']"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: 0.5 + (index * 0.2)
                    }}
                  >
                    {winner.marks}
                  </motion.div>
                </div>

                {/* Team name below the stage */}
                <h3 className="text-white text-2xl font-bold bg-purple-900 bg-opacity-50 px-6 py-2 rounded-lg">
                  {winner.teamName}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Decorative robots on the sides */}
        <div className="absolute left-10 bottom-10">
          <img
            src="/left-robo.png"
            alt="Robot decoration"
            className="h-60 w-auto"
          />
        </div>
        <div className="absolute right-10 bottom-10">
          <img
            src="/right-robo.png"
            alt="Robot decoration"
            className="h-60 w-auto"
          />
        </div>
      </div>
    </GameLayout>
  );
}
