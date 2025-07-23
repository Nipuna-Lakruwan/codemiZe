import React from 'react';
import JudgeLayout from './JudgeLayout';
import { useNavigate } from 'react-router-dom';

const JudgeDashboard = () => {
  const navigate = useNavigate();

  // Games to judge
  const games = [
    { id: 1, title: 'Quiz Hunters', path: '/judge/quiz-hunters', icon: '/quiz_hunters_logo-removebg 1.png' },
    { id: 2, title: 'Code Crushers', path: '/judge/code-crushers', icon: '/code crushers logo 1.png' },
    { id: 3, title: 'Circuit Smashers', path: '/judge/circuit-smashers', icon: '/circuit samshers logo 1.png' },
    { id: 4, title: 'Route Seekers', path: '/judge/route-seekers', icon: '/circuit samshers logo 1.png' },
    { id: 5, title: 'Battle Breakers', path: '/judge/battle-breakers', icon: '/Battle breakers logo 1.png' }
  ];

  const navigateToGame = (path) => {
    navigate(path);
  };

  return (
    <JudgeLayout gameName="Judge Dashboard">
      <div className="text-gray-800">
        <h2 className="text-xl font-semibold mb-6">Welcome to the Judge Dashboard</h2>
        <p className="mb-8">Select a game below to start judging submissions.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-gray-100 rounded-lg p-6 shadow-md hover:shadow-lg transition-all cursor-pointer"
              onClick={() => navigateToGame(game.path)}
            >
              <div className="flex items-center mb-3">
                <img src={game.icon} alt={game.title} className="w-12 h-12 mr-4" />
                <h3 className="text-lg font-medium">{game.title}</h3>
              </div>
              <p className="text-sm text-gray-600">Click to review submissions</p>
            </div>
          ))}
        </div>
      </div>
    </JudgeLayout>
  );
};

export default JudgeDashboard;
