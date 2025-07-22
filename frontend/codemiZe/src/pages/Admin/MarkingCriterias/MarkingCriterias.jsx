import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import AdminBox from '../../../components/Admin/QuizComponents/AdminBox';
import CriteriaItem from '../../../components/Admin/CriteriaComponents/CriteriaItem';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import AlertModal from '../../../components/Admin/QuizComponents/AlertModal';
import ConfirmationModal from '../../../components/Admin/QuizComponents/ConfirmationModal';

export default function MarkingCriterias() {
  // State for criteria
  const [criterias, setCriterias] = useState({ common: [], gameSpecific: {} });
  const [newCriteria, setNewCriteria] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCriteria, setEditingCriteria] = useState({ id: null, text: '', gameId: null });
  const [isLoading, setIsLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState(null);
  const [activeTab, setActiveTab] = useState('common');
  const [selectedGame, setSelectedGame] = useState(null);

  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [criteriaToDelete, setCriteriaToDelete] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'warning', or 'error'
  });

  // Mock data for common criteria
  const mockCommonCriteria = [
    { _id: 'c1', criteria: 'Code quality and organization' },
    { _id: 'c2', criteria: 'Functionality and completeness' },
    { _id: 'c3', criteria: 'Efficiency and performance' },
    { _id: 'c4', criteria: 'User interface design' },
    { _id: 'c5', criteria: 'Documentation and comments' }
  ];

  // Mock data for games
  const mockGames = [
    { _id: 'g1', name: 'Quiz Hunters', icon: '📝' },
    { _id: 'g2', name: 'Battle Breakers', icon: '⚔️' },
    { _id: 'g3', name: 'Code Crushers', icon: '💻' },
    { _id: 'g4', name: 'Circuit Smashers', icon: '⚡' },
    { _id: 'g5', name: 'Route Seekers', icon: '🔍' }
  ];

  // Mock data for game-specific criteria
  const mockGameCriteria = {
    g1: [
      { _id: 'qh1', criteria: 'Question accuracy', gameId: 'g1' },
      { _id: 'qh2', criteria: 'Response time', gameId: 'g1' },
      { _id: 'qh3', criteria: 'Answer completeness', gameId: 'g1' }
    ],
    g2: [
      { _id: 'bb1', criteria: 'Strategy development', gameId: 'g2' },
      { _id: 'bb2', criteria: 'Resource management', gameId: 'g2' }
    ],
    g3: [
      { _id: 'cc1', criteria: 'Algorithm complexity', gameId: 'g3' },
      { _id: 'cc2', criteria: 'Code readability', gameId: 'g3' },
      { _id: 'cc3', criteria: 'Error handling', gameId: 'g3' }
    ],
    g4: [
      { _id: 'cs1', criteria: 'Circuit design', gameId: 'g4' },
      { _id: 'cs2', criteria: 'Component optimization', gameId: 'g4' }
    ],
    g5: [
      { _id: 'rs1', criteria: 'Path finding efficiency', gameId: 'g5' },
      { _id: 'rs2', criteria: 'Network topology understanding', gameId: 'g5' }
    ]
  };

  // Initialize with mock data on component mount
  useEffect(() => {
    fetchCriterias();
  }, []);

  const fetchCriterias = async () => {
    setIsLoading(true);
    try {
      // Simulating API call with mock data
      setTimeout(() => {
        setCriterias({
          common: mockCommonCriteria,
          gameSpecific: mockGameCriteria
        });
        setIsLoading(false);
      }, 800); // Simulate network delay
    } catch (error) {
      console.error('Error fetching criteria:', error);
      showAlert('Failed to load marking criteria', 'Error', 'error');
      setIsLoading(false);
    }
  };

  const handleAddCriteria = async () => {
    if (!newCriteria.trim()) {
      showAlert('Criteria text cannot be empty', 'Validation Error', 'error');
      return;
    }

    try {
      // Simulate API call with mock data
      setTimeout(() => {
        const newItem = {
          _id: Date.now().toString(), // Use timestamp as mock ID
          criteria: newCriteria.trim(),
          ...(activeTab === 'gameSpecific' && selectedGame ? { gameId: selectedGame } : {})
        };

        if (activeTab === 'common') {
          setCriterias(prev => ({
            ...prev,
            common: [...prev.common, newItem]
          }));
        } else if (activeTab === 'gameSpecific' && selectedGame) {
          setCriterias(prev => ({
            ...prev,
            gameSpecific: {
              ...prev.gameSpecific,
              [selectedGame]: [...(prev.gameSpecific[selectedGame] || []), newItem]
            }
          }));
        }

        setNewCriteria('');
        showAlert('Criteria added successfully', 'Success', 'success');
      }, 500); // Simulate network delay
    } catch (error) {
      console.error('Error adding criteria:', error);
      showAlert('Failed to add criteria', 'Error', 'error');
    }
  };

  const startEditingCriteria = (criteria, gameId = null) => {
    setEditingCriteria({
      id: criteria._id,
      text: criteria.criteria,
      gameId
    });
  };

  const cancelEditing = () => {
    setEditingCriteria({ id: null, text: '', gameId: null });
  };

  const handleUpdateCriteria = async () => {
    if (!editingCriteria.text.trim()) {
      showAlert('Criteria text cannot be empty', 'Validation Error', 'error');
      return;
    }

    try {
      // Simulate API call with mock data
      setTimeout(() => {
        if (editingCriteria.gameId) {
          // Update game-specific criteria
          setCriterias(prev => ({
            ...prev,
            gameSpecific: {
              ...prev.gameSpecific,
              [editingCriteria.gameId]: prev.gameSpecific[editingCriteria.gameId].map(c =>
                c._id === editingCriteria.id
                  ? { ...c, criteria: editingCriteria.text.trim() }
                  : c
              )
            }
          }));
        } else {
          // Update common criteria
          setCriterias(prev => ({
            ...prev,
            common: prev.common.map(c =>
              c._id === editingCriteria.id
                ? { ...c, criteria: editingCriteria.text.trim() }
                : c
            )
          }));
        }

        cancelEditing();
        showAlert('Criteria updated successfully', 'Success', 'success');
      }, 500); // Simulate network delay
    } catch (error) {
      console.error('Error updating criteria:', error);
      showAlert('Failed to update criteria', 'Error', 'error');
    }
  };

  const confirmDeleteCriteria = (criteria, gameId = null) => {
    setCriteriaToDelete({ ...criteria, gameId });
    setShowDeleteModal(true);
  };

  const handleDeleteCriteria = async () => {
    if (!criteriaToDelete) return;

    try {
      // Simulate API call with mock data
      setTimeout(() => {
        if (criteriaToDelete.gameId) {
          // Delete game-specific criteria
          setCriterias(prev => ({
            ...prev,
            gameSpecific: {
              ...prev.gameSpecific,
              [criteriaToDelete.gameId]: prev.gameSpecific[criteriaToDelete.gameId].filter(
                c => c._id !== criteriaToDelete._id
              )
            }
          }));
        } else {
          // Delete common criteria
          setCriterias(prev => ({
            ...prev,
            common: prev.common.filter(c => c._id !== criteriaToDelete._id)
          }));
        }

        setShowDeleteModal(false);
        setCriteriaToDelete(null);
        showAlert('Criteria deleted successfully', 'Success', 'success');
      }, 500); // Simulate network delay
    } catch (error) {
      console.error('Error deleting criteria:', error);
      showAlert('Failed to delete criteria', 'Error', 'error');
      setShowDeleteModal(false);
    }
  };

  const showAlert = (message, title, type = 'info') => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeAlertModal = () => {
    setAlertModal({ ...alertModal, isOpen: false });
  };

  // Drag and drop handlers
  const handleDragStart = (index, gameId = null) => {
    setDraggedItem({ index, gameId });
  };

  const handleDragOver = (e, index, gameId = null) => {
    e.preventDefault();

    if (!draggedItem) return;

    // If the item is dragged over itself, ignore
    if (draggedItem.index === index && draggedItem.gameId === gameId) {
      return;
    }

    // Ensure we're dragging within the same list (common or same game)
    if (draggedItem.gameId !== gameId) {
      return; // Can't drag between common and game-specific or between different games
    }

    if (gameId) {
      // Handle game-specific criteria reordering
      setCriterias(prev => {
        const gameItems = [...prev.gameSpecific[gameId]];
        const draggedItemContent = gameItems.splice(draggedItem.index, 1)[0];
        gameItems.splice(index, 0, draggedItemContent);

        return {
          ...prev,
          gameSpecific: {
            ...prev.gameSpecific,
            [gameId]: gameItems
          }
        };
      });
    } else {
      // Handle common criteria reordering
      setCriterias(prev => {
        const commonItems = [...prev.common];
        const draggedItemContent = commonItems.splice(draggedItem.index, 1)[0];
        commonItems.splice(index, 0, draggedItemContent);

        return {
          ...prev,
          common: commonItems
        };
      });
    }

    // Update draggedItem index
    setDraggedItem({ index, gameId });
  }; return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Marking Criterias</h1>
        <p className="text-gray-600 mb-6">
          Configure marking criteria for all games commonly or for each game individually.
        </p>

        {/* Tabs for Common/Game-specific */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'common'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600'}`}
            onClick={() => {
              setActiveTab('common');
              setSelectedGame(null);
            }}
          >
            Common Criteria
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'gameSpecific'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600'}`}
            onClick={() => {
              setActiveTab('gameSpecific');
              if (!selectedGame && mockGames.length > 0) {
                setSelectedGame(mockGames[0]._id);
              }
            }}
          >
            Game-specific Criteria
          </button>
        </div>

        {activeTab === 'gameSpecific' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Game:
            </label>
            <div className="flex flex-wrap gap-2">
              {mockGames.map(game => (
                <button
                  key={game._id}
                  onClick={() => setSelectedGame(game._id)}
                  className={`px-4 py-2 rounded-md ${selectedGame === game._id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                >
                  <span className="mr-2">{game.icon}</span>
                  {game.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Criteria Box */}
          <AdminBox
            title={activeTab === 'common'
              ? "Add New Common Criteria"
              : `Add New Criteria for ${mockGames.find(g => g._id === selectedGame)?.name || 'Game'}`
            }
            width="w-full"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newCriteria}
                  onChange={(e) => setNewCriteria(e.target.value)}
                  placeholder="Enter criteria text..."
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCriteria.trim()) {
                      handleAddCriteria();
                    }
                  }}
                  disabled={activeTab === 'gameSpecific' && !selectedGame}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddCriteria}
                  className="bg-purple-600 text-white px-4 py-2 rounded-r-md flex items-center justify-center hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed"
                  disabled={!newCriteria.trim() || (activeTab === 'gameSpecific' && !selectedGame)}
                >
                  <FaPlus className="mr-2" /> Add
                </motion.button>
              </div>
              <p className="text-sm text-gray-500">
                {activeTab === 'common'
                  ? "Add marking criteria that will be used for evaluating student work across all games."
                  : `Add specific marking criteria for ${mockGames.find(g => g._id === selectedGame)?.name || 'this game'}.`
                }
              </p>
            </div>
          </AdminBox>

          {/* Existing Criteria Box */}
          <AdminBox
            title={activeTab === 'common'
              ? "Existing Common Criteria"
              : `Criteria for ${mockGames.find(g => g._id === selectedGame)?.name || 'Game'}`
            }
            width="w-full"
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : (activeTab === 'common' && criterias.common.length === 0) ||
              (activeTab === 'gameSpecific' && selectedGame &&
                (!criterias.gameSpecific[selectedGame] || criterias.gameSpecific[selectedGame].length === 0)) ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No {activeTab === 'common' ? 'common' : 'game-specific'} marking criteria found. Add your first criteria above.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-3 bg-blue-50 p-2 rounded text-sm text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Drag and drop items to reorder. Click the edit icon to modify criteria.</span>
                </div>

                {/* Search box */}
                <div className="mb-3">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search criteria..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {(() => {
                    // Determine which criteria to show based on active tab and selected game
                    const currentCriterias = activeTab === 'common'
                      ? criterias.common
                      : (selectedGame && criterias.gameSpecific[selectedGame])
                        ? criterias.gameSpecific[selectedGame]
                        : [];

                    // Filter by search term
                    const filteredCriterias = currentCriterias.filter(criteria =>
                      criteria.criteria.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (filteredCriterias.length === 0) {
                      if (searchTerm) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">No criteria match your search for "{searchTerm}"</p>
                            <button
                              onClick={() => setSearchTerm('')}
                              className="mt-2 text-purple-600 hover:text-purple-800 underline"
                            >
                              Clear search
                            </button>
                          </div>
                        );
                      } else if (activeTab === 'gameSpecific' && !selectedGame) {
                        return (
                          <div className="text-center py-8">
                            <p className="text-gray-500">Please select a game to view its criteria.</p>
                          </div>
                        );
                      }
                    }

                    return filteredCriterias.map((criteria, index) => (
                      <div
                        key={criteria._id}
                        draggable
                        onDragStart={() => handleDragStart(index, activeTab === 'gameSpecific' ? selectedGame : null)}
                        onDragOver={(e) => handleDragOver(e, index, activeTab === 'gameSpecific' ? selectedGame : null)}
                        onDragEnd={() => setDraggedItem(null)}
                        className={`cursor-move ${draggedItem &&
                            draggedItem.index === index &&
                            draggedItem.gameId === (activeTab === 'gameSpecific' ? selectedGame : null)
                            ? 'opacity-50 bg-gray-100 border border-dashed border-purple-500'
                            : ''
                          }`}
                      >
                        <CriteriaItem
                          criteria={criteria}
                          isEditing={editingCriteria.id === criteria._id}
                          editingText={editingCriteria.text}
                          onEditChange={(value) => setEditingCriteria({ ...editingCriteria, text: value })}
                          onStartEdit={() => startEditingCriteria(
                            criteria,
                            activeTab === 'gameSpecific' ? selectedGame : null
                          )}
                          onSaveEdit={handleUpdateCriteria}
                          onCancelEdit={cancelEditing}
                          onDelete={() => confirmDeleteCriteria(
                            criteria,
                            activeTab === 'gameSpecific' ? selectedGame : null
                          )}
                          gameSpecific={activeTab === 'gameSpecific'}
                          gameName={selectedGame ? mockGames.find(g => g._id === selectedGame)?.name : ''}
                        />
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </AdminBox>
        </div>

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.isOpen}
          onClose={closeAlertModal}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteCriteria}
          title="Delete Criteria"
          message={
            criteriaToDelete
              ? `Are you sure you want to delete this ${criteriaToDelete.gameId ? 'game-specific' : 'common'} criteria: "${criteriaToDelete?.criteria}"? ${criteriaToDelete.gameId
                ? `This will only affect ${mockGames.find(g => g._id === criteriaToDelete.gameId)?.name || 'this game'}.`
                : 'This will affect all games.'
              } This action cannot be undone.`
              : 'Are you sure you want to delete this criteria? This action cannot be undone.'
          }
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </AdminLayout>
  );
}
