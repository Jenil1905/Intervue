import React from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

function Logout({ isOpen, onClose, onConfirm }) {
  // If the modal isn't open, render nothing.
  if (!isOpen) {
    return null;
  }

  return (
    // Main overlay - covers the screen with a semi-transparent background
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose} // Close modal if background is clicked
    >
      {/* Modal Content - stop propagation to prevent closing when clicking inside */}
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center"
        onClick={e => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <FaExclamationTriangle className="h-6 w-6 text-red-600" />
        </div>

        {/* Title */}
        <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">
          Confirm Logout
        </h3>
        
        {/* Message */}
        <div className="mt-2">
          <p className="text-sm text-gray-500">
            Are you sure you want to log out of your account?
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            onClick={onConfirm}
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;