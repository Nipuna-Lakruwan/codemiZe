import React, { useState, useEffect } from 'react';
import AdminLayout from '../../../components/Admin/AdminLayout';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import CriteriaItem from '../../../components/Admin/CriteriaComponents/CriteriaItem';
import axiosInstance from '../../../utils/axiosInstance';
import { API_PATHS } from '../../../utils/apiPaths';
import AlertModal from '../../../components/Admin/QuizComponents/AlertModal';
import ConfirmationModal from '../../../components/Admin/QuizComponents/ConfirmationModal';

export default function MarkingCriterias() {
  // State for criteria - removed common criteria
  const [criterias, setCriterias] = useState({ gameSpecific: {} });
  const [newCriteria, setNewCriteria] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCriteria, setEditingCriteria] = useState({ id: null, text: '', gameType: null });
  const [isLoading, setIsLoading] = useState(true);
  // Default to game specific criteria as we removed common
  const [selectedGame, setSelectedGame] = useState('codeCrushers'); // Default to Code Crushers

  // State for modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [criteriaToDelete, setCriteriaToDelete] = useState(null);
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info', // 'info', 'success', 'warning', or 'error'
  });

  // Removed mock data for common criteria

  // Mock data for games - only including Code Crushers, Circuit Smashers, and Route Seekers
  const mockGames = [
    { _id: 'codeCrushers', name: 'Code Crushers' },
    { _id: 'circuitSmashers', name: 'Circuit Smashers' },
    { _id: 'routeSeekers', name: 'Route Seekers' }
  ];

  // Mock data for game-specific criteria - matching new schema structure
  const mockGameCriteria = {
    codeCrushers: [
      { _id: 'cc1', criteria: 'Algorithm complexity', gameType: 'codeCrushers' },
      { _id: 'cc2', criteria: 'Code readability', gameType: 'codeCrushers' },
      { _id: 'cc3', criteria: 'Error handling', gameType: 'codeCrushers' }
    ],
    circuitSmashers: [
      { _id: 'cs1', criteria: 'Circuit design', gameType: 'circuitSmashers' },
      { _id: 'cs2', criteria: 'Component optimization', gameType: 'circuitSmashers' }
    ],
    routeSeekers: [
      { _id: 'rs1', criteria: 'Path finding efficiency', gameType: 'routeSeekers' },
      { _id: 'rs2', criteria: 'Network topology understanding', gameType: 'routeSeekers' }
    ]
  };

  // Initialize with mock data on component mount
  useEffect(() => {
    fetchCriterias();
  }, []);

  const fetchCriterias = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.CRITERIA.GET_ALL);
      
      if (response.data.success) {
        setCriterias({
          gameSpecific: response.data.data
        });
      } else {
        console.error('Failed to fetch criteria:', response.data.message);
        showAlert('Failed to load marking criteria', 'Error', 'error');
      }
    } catch (error) {
      console.error('Error fetching criteria:', error);
      showAlert('Failed to load marking criteria', 'Error', 'error');
      
      // Fallback to mock data on error
      setCriterias({
        gameSpecific: mockGameCriteria
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCriteria = async () => {
    if (!newCriteria.trim()) {
      showAlert('Criteria text cannot be empty', 'Validation Error', 'error');
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATHS.CRITERIA.CREATE, {
        criteria: newCriteria.trim(),
        gameType: selectedGame
      });

      if (response.data.success) {
        const newItem = response.data.data;

        // Update local state
        setCriterias(prev => ({
          ...prev,
          gameSpecific: {
            ...prev.gameSpecific,
            [selectedGame]: [...(prev.gameSpecific[selectedGame] || []), newItem]
          }
        }));

        setNewCriteria('');
        showAlert('Criteria added successfully', 'Success', 'success');
      } else {
        showAlert(response.data.message || 'Failed to add criteria', 'Error', 'error');
      }
    } catch (error) {
      console.error('Error adding criteria:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add criteria';
      showAlert(errorMessage, 'Error', 'error');
    }
  };

  const startEditingCriteria = (criteria, gameType = null) => {
    setEditingCriteria({
      id: criteria._id,
      text: criteria.criteria,
      gameType
    });
  };

  const cancelEditing = () => {
    setEditingCriteria({ id: null, text: '', gameType: null });
  };

  const handleUpdateCriteria = async () => {
    if (!editingCriteria.text.trim()) {
      showAlert('Criteria text cannot be empty', 'Validation Error', 'error');
      return;
    }

    try {
      const response = await axiosInstance.put(API_PATHS.CRITERIA.UPDATE(editingCriteria.id), {
        criteria: editingCriteria.text.trim(),
        gameType: editingCriteria.gameType
      });

      if (response.data.success) {
        const updatedItem = response.data.data;

        // Update local state
        setCriterias(prev => ({
          ...prev,
          gameSpecific: {
            ...prev.gameSpecific,
            [editingCriteria.gameType]: prev.gameSpecific[editingCriteria.gameType].map(c =>
              c._id === editingCriteria.id ? updatedItem : c
            )
          }
        }));

        cancelEditing();
        showAlert('Criteria updated successfully', 'Success', 'success');
      } else {
        showAlert(response.data.message || 'Failed to update criteria', 'Error', 'error');
      }
    } catch (error) {
      console.error('Error updating criteria:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update criteria';
      showAlert(errorMessage, 'Error', 'error');
    }
  };

  const confirmDeleteCriteria = (criteria, gameType = null) => {
    setCriteriaToDelete({ ...criteria, gameType });
    setShowDeleteModal(true);
  };

  const handleDeleteCriteria = async () => {
    if (!criteriaToDelete) return;

    try {
      const response = await axiosInstance.delete(API_PATHS.CRITERIA.DELETE(criteriaToDelete._id));

      if (response.data.success) {
        // Update local state
        setCriterias(prev => ({
          ...prev,
          gameSpecific: {
            ...prev.gameSpecific,
            [criteriaToDelete.gameType]: prev.gameSpecific[criteriaToDelete.gameType].filter(
              c => c._id !== criteriaToDelete._id
            )
          }
        }));

        setShowDeleteModal(false);
        setCriteriaToDelete(null);
        showAlert('Criteria deleted successfully', 'Success', 'success');
      } else {
        showAlert(response.data.message || 'Failed to delete criteria', 'Error', 'error');
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting criteria:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete criteria';
      showAlert(errorMessage, 'Error', 'error');
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

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Marking Criteria Management</h1>
        </div>

        {/* Game Selection */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Select Game:
          </label>
          <div className="flex flex-wrap gap-3">
            {mockGames.map(game => (
              <button
                key={game._id}
                onClick={() => setSelectedGame(game._id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedGame === game._id
                    ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-300 hover:text-purple-600 hover:shadow-md'
                }`}
              >
                {game.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-[calc(100vh-280px)]">
          {/* Add New Criteria Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-fit">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <FaPlus className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Criteria</h2>
                <p className="text-sm text-gray-500">
                  For {mockGames.find(g => g._id === selectedGame)?.name || 'Game'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={newCriteria}
                  onChange={(e) => setNewCriteria(e.target.value)}
                  placeholder="Enter criteria description..."
                  className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCriteria.trim()) {
                      handleAddCriteria();
                    }
                  }}
                  disabled={!selectedGame}
                />
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddCriteria}
                className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
                disabled={!newCriteria.trim() || !selectedGame}
              >
                <FaPlus className="text-sm" />
                <span>Add Criteria</span>
              </motion.button>
            </div>
          </div>

          {/* Existing Criteria Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 h-[600px] flex flex-col">
            <div className="flex items-center justify-between mb-6 flex-shrink-0">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012-2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Current Criteria</h2>
                  <p className="text-sm text-gray-500">
                    For {mockGames.find(g => g._id === selectedGame)?.name || 'Game'}
                  </p>
                </div>
              </div>
              {selectedGame && criterias.gameSpecific[selectedGame] && (
                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                  {criterias.gameSpecific[selectedGame].length} criteria
                </div>
              )}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                  <p className="text-gray-500">Loading criteria...</p>
                </div>
              ) : (selectedGame &&
                (!criterias.gameSpecific[selectedGame] || criterias.gameSpecific[selectedGame].length === 0)) ? (
                <div className="text-center h-full flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No criteria found</h3>
                  <p className="text-gray-500 mb-6">
                    No marking criteria have been added for this game yet. Add your first criteria using the form on the left.
                  </p>
                </div>
              ) : (
                <>
                  {/* Search box */}
                  <div className="mb-6 flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search criteria..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">{(() => {
                      // Get criteria for selected game
                      const currentCriterias = (selectedGame && criterias.gameSpecific[selectedGame])
                        ? criterias.gameSpecific[selectedGame]
                        : [];

                      // Filter by search term
                      const filteredCriterias = currentCriterias.filter(criteria =>
                        criteria.criteria.toLowerCase().includes(searchTerm.toLowerCase())
                      );

                      if (filteredCriterias.length === 0 && searchTerm) {
                        return (
                          <div className="text-center py-8">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                            <p className="text-gray-500 mb-4">No criteria match your search for "{searchTerm}"</p>
                            <button
                              onClick={() => setSearchTerm('')}
                              className="text-purple-600 hover:text-purple-800 font-medium underline"
                            >
                              Clear search
                            </button>
                          </div>
                        );
                      }

                      return filteredCriterias.map((criteria) => (
                        <div
                          key={criteria._id}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200"
                        >
                          <CriteriaItem
                            criteria={criteria}
                            isEditing={editingCriteria.id === criteria._id}
                            editingText={editingCriteria.text}
                            onEditChange={(value) => setEditingCriteria({ ...editingCriteria, text: value })}
                            onStartEdit={() => startEditingCriteria(criteria, selectedGame)}
                            onSaveEdit={handleUpdateCriteria}
                            onCancelEdit={cancelEditing}
                            onDelete={() => confirmDeleteCriteria(criteria, selectedGame)}
                            gameSpecific={true}
                            gameName={selectedGame ? mockGames.find(g => g._id === selectedGame)?.name : ''}
                          />
                        </div>
                      ));
                    })()}
                  </div>
                </>
              )}
            </div>
          </div>
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
              ? `Are you sure you want to delete this criteria: "${criteriaToDelete?.criteria}"? This will only affect ${mockGames.find(g => g._id === criteriaToDelete.gameType)?.name || 'this game'}. This action cannot be undone.`
              : 'Are you sure you want to delete this criteria? This action cannot be undone.'
          }
          confirmText="Delete"
          cancelText="Cancel"
        />
      </div>
    </AdminLayout>
  );
}
