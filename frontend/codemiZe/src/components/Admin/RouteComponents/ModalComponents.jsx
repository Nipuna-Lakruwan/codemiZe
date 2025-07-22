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
  confirmDeleteNetworkResources
}) => {
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
    </>
  );
};

export default ModalComponents;
