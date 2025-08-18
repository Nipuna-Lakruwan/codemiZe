import React from 'react';
import AlertModal from '../QuizComponents/AlertModal';
import ConfirmationModal from '../QuizComponents/ConfirmationModal';

const ModalComponents = ({
  alertModal,
  closeAlert,
  showDeleteQuestionsModal,
  setShowDeleteQuestionsModal,
  confirmDeleteQuestions,
  showDeleteResourcesModal,
  setShowDeleteResourcesModal,
  confirmDeleteResources,
  showDeleteNetworkResourceModal,
  setShowDeleteNetworkResourceModal,
  confirmDeleteNetworkResources,
  // Questionnaire modal props
  showQuestionsModal,
  setShowQuestionsModal,
  questions = [],
  questionSearch,
  setQuestionSearch
}) => {
  const filteredQuestions = questions.filter(q => {
    const term = (questionSearch || '').toLowerCase();
    if (!term) return true;
    return q.question?.toLowerCase().includes(term) || q.answer?.toLowerCase().includes(term);
  });
  return (
    <>
      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteQuestionsModal}
        onClose={() => setShowDeleteQuestionsModal(false)}
        onConfirm={confirmDeleteQuestions}
        title="Delete All Questions"
        message="Are you sure you want to delete ALL questions? This action cannot be undone."
        confirmText="Delete All"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showDeleteResourcesModal}
        onClose={() => setShowDeleteResourcesModal(false)}
        onConfirm={confirmDeleteResources}
        title="Delete All Resources"
        message="Are you sure you want to delete ALL resources? This action cannot be undone."
        confirmText="Delete All"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showDeleteNetworkResourceModal}
        onClose={() => setShowDeleteNetworkResourceModal(false)}
        onConfirm={confirmDeleteNetworkResources}
        title="Delete All Network Resources"
        message="Are you sure you want to delete ALL network resources? This action cannot be undone."
        confirmText="Delete All"
        type="danger"
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertModal.isOpen}
        onClose={closeAlert}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        buttonText="Okay"
      />

      {/* Questionnaire View Modal */}
      {showQuestionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-[800px] max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-purple-800">Questionnaire ({questions.length})</h3>
              <button
                onClick={() => setShowQuestionsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            {/* Search */}
            <div className="px-6 py-3 border-b bg-gray-50">
              <input
                type="text"
                placeholder="Search question or answer..."
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-800"
              />
            </div>
            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
              {filteredQuestions.length === 0 ? (
                <div className="text-center text-gray-500 text-sm">No questions match your search.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-xs uppercase text-gray-600 border-b">
                      <th className="py-2 pr-3 w-12">#</th>
                      <th className="py-2 pr-3">Question</th>
                      <th className="py-2">Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.map((q, idx) => (
                      <tr key={q._id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-2 pr-3 align-top text-gray-500">{idx + 1}</td>
                        <td className="py-2 pr-3 whitespace-pre-wrap">{q.question}</td>
                        <td className="py-2 whitespace-pre-wrap text-green-700 font-medium">{q.answer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {/* Footer */}
            <div className="px-6 py-3 border-t flex justify-end gap-3">
              <button
                onClick={() => { setQuestionSearch(''); setShowQuestionsModal(false); }}
                className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700"
              >Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalComponents;
