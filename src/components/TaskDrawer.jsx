import { useState } from 'react';
import { X, Phone, User, Calendar, Clock, Tag, FileText, MessageSquare, ChevronDown } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { toast } from './Toast';

const TaskDrawer = ({ task, isOpen, onClose, onMarkComplete, onReassign, onChangePriority }) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  if (!isOpen || !task) return null;

  const handleAction = (action) => {
    setShowActionMenu(false);
    
    switch (action) {
      case 'complete':
        onMarkComplete(task);
        onClose();
        break;
      case 'reassign':
        toast.info('Reassignment feature coming soon');
        break;
      case 'reject':
        toast.info('Marked seller as rejected');
        break;
      case 'not-possible':
        toast.info('Marked as not possible');
        break;
      default:
        break;
    }
  };

  const handleCallSeller = () => {
    setShowCallModal(true);
  };

  const handleStartCall = () => {
    toast.info('Call initiated');
    setShowCallModal(false);
    onClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Task ID and Priority */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm font-medium text-gray-500">#{task.id}</span>
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {task.title}
          </h3>

          {/* Type */}
          <p className="text-sm text-gray-600 mb-6">
            {task.type}
          </p>

          {/* Status */}
          <div className="mb-6">
            <StatusBadge status={task.status} dueAt={task.dueAt} />
          </div>

          {/* Details Grid */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Created</p>
                <p className="text-sm text-gray-600">{formatDate(task.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Due Date</p>
                <p className="text-sm text-gray-600">{formatDate(task.dueAt)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Owner</p>
                <p className="text-sm text-gray-600">{task.owner}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tag className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Seller ID</p>
                <p className="text-sm text-gray-600">{task.sellerId}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Description</h4>
            </div>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              {task.description}
            </p>
          </div>

          {/* Completion Remarks */}
          {task.completionRemarks && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-green-500" />
                <h4 className="text-sm font-medium text-gray-900">Completion Remarks</h4>
              </div>
              <p className="text-sm text-gray-600 bg-green-50 border border-green-200 p-3 rounded-md">
                {task.completionRemarks}
              </p>
            </div>
          )}

          {/* Activity History */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Activity History</h4>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p className="font-medium">Task created</p>
                <p className="text-xs text-gray-500">{formatDate(task.createdAt)}</p>
              </div>
              {task.completedAt && (
                <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-md">
                  <p className="font-medium text-green-700">Task completed</p>
                  <p className="text-xs text-gray-500">{formatDate(task.completedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {task.status !== 'Closed' && (
            <div className="space-y-3">
              <button
                onClick={handleCallSeller}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Seller
              </button>
              
              {/* Take Action Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowActionMenu(!showActionMenu)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                >
                  Take Action
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Dropdown Menu */}
                {showActionMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowActionMenu(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute right-0 bottom-full mb-1 w-full bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
                      <button
                        onClick={() => handleAction('complete')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Mark as Done
                      </button>
                      <button
                        onClick={() => handleAction('reassign')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Re-assign Task
                      </button>
                      <button
                        onClick={() => handleAction('reject')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Mark Seller as Rejected
                      </button>
                      <button
                        onClick={() => handleAction('not-possible')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        Mark Not Possible
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Seller</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Phone:</p>
              <p className="text-lg font-medium text-gray-900">+91 XXXXX XXXXX</p>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Reason:</p>
              <p className="text-sm text-gray-900">{task.title}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCallModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartCall}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start Call
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskDrawer;