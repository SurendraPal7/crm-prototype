import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { toast } from './Toast';

const BulkCompleteModal = ({ taskCount, isOpen, onClose, onConfirm }) => {
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !taskCount) return null;

  const handleConfirm = async () => {
    if (isSubmitting) return;
    
    const trimmedRemarks = remarks.trim();
    if (!trimmedRemarks) {
      toast.error('Completion remarks are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onConfirm(trimmedRemarks);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRemarks('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Mark Tasks Complete</h3>
            </div>
            <button 
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Confirmation Message */}
            <div className="mb-4">
              <p className="text-gray-700">
                Are you sure you want to mark <strong>{taskCount}</strong> task{taskCount > 1 ? 's' : ''} as complete?
              </p>
            </div>

            {/* Remarks Input */}
            <div className="mb-6">
              <label htmlFor="bulk-remarks" className="block text-sm font-medium text-gray-900 mb-2">
                Completion Remarks
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="bulk-remarks"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 resize-none ${
                  remarks.trim() 
                    ? 'border-gray-300 focus:ring-green-500 focus:border-green-500' 
                    : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                }`}
                placeholder="Please describe what was done to complete these tasks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={500}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-red-600">
                  * Required - This remark will be applied to all selected tasks
                </p>
                <span className={`text-xs ${remarks.length > 450 ? 'text-red-500' : 'text-gray-400'}`}>
                  {remarks.length}/500
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={isSubmitting || !remarks.trim()}
                className={`flex-1 px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center gap-2 ${
                  isSubmitting || !remarks.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Completing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Mark {taskCount} Complete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BulkCompleteModal;