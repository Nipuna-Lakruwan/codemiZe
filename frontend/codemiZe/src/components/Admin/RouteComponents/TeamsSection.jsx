import React from 'react';
import { motion } from 'framer-motion';
import AdminBox from '../QuizComponents/AdminBox';
import TeamQuestionsView from './TeamQuestionsView';
import NetworkDiagramsView from './NetworkDiagramsView';
import TotalMarksView from './TotalMarksView';

const TeamsSection = ({ teams, activeTab, setActiveTab, handleViewTeam, viewingTeam, teamQuestions, handleBackToTeams, handleMarkCorrect, handleMarkIncorrect }) => {
  // If we're viewing a specific team's questions
  if (viewingTeam) {
    return (
      <TeamQuestionsView
        team={viewingTeam}
        questions={teamQuestions}
        onBack={handleBackToTeams}
        onMarkCorrect={handleMarkCorrect}
        onMarkIncorrect={handleMarkIncorrect}
      />
    );
  }

  return (
    <AdminBox minHeight="auto">
      <div className="mt-6 mb-6">
        {/* Tabs */}
        <div className="flex mb-6 justify-center">
          <div className="w-[462px] h-9 bg-white rounded-[3px] border border-black/20 flex items-center">
            <div
              className={`flex-1 h-full flex items-center justify-center cursor-pointer ${activeTab === 'Questioners' ? 'bg-sky-600 text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('Questioners')}
            >
              <span className="text-xs font-medium">Questioners</span>
            </div>
            <div
              className={`flex-1 h-full flex items-center justify-center cursor-pointer ${activeTab === 'Network Diagrams' ? 'bg-sky-600 text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('Network Diagrams')}
            >
              <span className="text-xs font-medium">Network Diagrams</span>
            </div>
            <div
              className={`flex-1 h-full flex items-center justify-center cursor-pointer ${activeTab === 'Total Marks' ? 'bg-sky-600 text-white' : 'text-gray-700'}`}
              onClick={() => setActiveTab('Total Marks')}
            >
              <span className="text-xs font-medium">Total Marks</span>
            </div>
          </div>
        </div>

        {/* Render different views based on activeTab */}
        {activeTab === 'Questioners' && (
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {teams.map(team => (
              <div
                key={team.id}
                className="w-[860px] h-16 bg-white rounded-md shadow-[3px_6px_14.2px_-2px_rgba(0,0,0,0.25)] border-l-[15px] border-sky-400 mx-auto flex items-center"
              >
                {/* Team Logo */}
                <div className="w-14 h-16 bg-neutral-500 flex items-center justify-center">
                  <img src={team.logo || "/c-logo.png"} alt={team.name} className="max-w-full max-h-full object-cover" />
                </div>

                {/* Team Info */}
                <div className="flex-1 px-4">
                  <div className="justify-start text-black text-base font-medium font-['Oxanium']">
                    {team.name}
                  </div>
                  <div className="justify-start text-black/70 text-xs font-medium font-['Inter']">
                    {team.city}
                  </div>
                </div>

                {/* View Button */}
                <div className="pr-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleViewTeam(team)}
                    className="w-20 h-7 bg-purple-950 rounded-[3px] border border-slate-500/40 text-white text-xs flex items-center justify-center"
                  >
                    View
                  </motion.button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Network Diagrams Tab Content */}
        {activeTab === 'Network Diagrams' && (
          <NetworkDiagramsView teams={teams} />
        )}

        {/* Total Marks Tab Content */}
        {activeTab === 'Total Marks' && (
          <TotalMarksView teams={teams} />
        )}
      </div>
    </AdminBox>
  );
};

export default TeamsSection;
