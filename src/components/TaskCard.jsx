import { Phone, MoreHorizontal, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { toast } from './Toast';

const TaskCard = ({ 
  task, 
  isSelected, 
  onToggleSelect, 
  onMarkComplete, 
  onReassign, 
  onChangePriority,
  onViewDetails,
  sellers = [], // Add sellers prop
}) => {
  const [showActionMenu, setShowActionMenu] = useState(false);

  // Get seller information
  const seller = sellers.find(s => s.id === task.sellerId);
  const sellerName = seller ? seller.name : 'Unknown Seller';

  const handleCallSeller = (e) => {
    e.stopPropagation();
    toast.info('Call initiated');
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    setShowActionMenu(false);
    
    switch (action) {
      case 'complete':
        onMarkComplete(task);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getSubTaskCounts = () => {
    // Simple task counts for display
    return {
      total: 1,
      open: task.status === 'Pending' ? 1 : 0,
      up: 0,
      closed: task.status === 'Closed' ? 1 : 0
    };
  };

  const getOverdueDays = () => {
    if (task.status === 'Closed') return null;
    const today = new Date();
    const dueDate = new Date(task.dueAt);
    const diffTime = today - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  const subTasks = getSubTaskCounts();
  const overdueDays = getOverdueDays();

  return (
    <div 
      className={`
        bg-white rounded-lg border border-gray-300 p-3 sm:p-4 transition-all cursor-pointer hover:shadow-md
        ${isSelected ? 'border-blue-500 bg-blue-50' : ''}
        ${task.status === 'Closed' ? 'opacity-75' : ''}
      `}
      onClick={() => onViewDetails && onViewDetails(task)}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Checkbox */}
        <div className="pt-1 flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSelect(task.id);
            }}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {/* Header with Category Tag */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
            <div className="flex-1">
              <div className="mb-2">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-medium border border-blue-200">
                  {task.category?.toUpperCase() || 'TASK'}
                </span>
              </div>
            </div>
          </div>

          {/* Task Title */}
          <div className="mb-3">
            <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
              {task.id}-{task.title}
            </h2>
          </div>

          {/* Created Date */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-700">
              Created on: {formatDate(task.createdAt)}
            </p>
          </div>

          {/* Sub-Tasks Count */}
          <div className="mb-4">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-gray-700 font-medium">{subTasks.total} Sub-Task (Open:</span>
              <span className="text-blue-600 font-medium">{subTasks.open}</span>
              <span className="text-gray-700 font-medium">| Up:</span>
              <span className="text-orange-600 font-medium">{subTasks.up}</span>
              <span className="text-gray-700 font-medium">| Closed:</span>
              <span className="text-green-600 font-medium">{subTasks.closed}</span>
              <span className="text-gray-700 font-medium">)</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mb-3"></div>

          {/* Owner and Status Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-md">
                {task.ownerType} {task.owner.split(' ').pop()}
              </span>
              <PriorityBadge priority={task.priority} size="sm" />
              
              {overdueDays && (
                <div className="text-red-500 font-medium text-xs">
                  Overdue By {overdueDays} Days
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {task.status !== 'Closed' && (
              <>
                <button
                  onClick={handleCallSeller}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </button>
                
                {/* Take Action Dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActionMenu(!showActionMenu);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
                  >
                    Take Action
                    <ChevronDown className="w-3 h-3" />
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
                      <div className="absolute right-0 bottom-full mb-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={(e) => handleAction(e, 'complete')}
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          Mark as Done
                        </button>
                        <button
                          onClick={(e) => handleAction(e, 'reassign')}
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                          Re-assign Task
                        </button>
                        <button
                          onClick={(e) => handleAction(e, 'reject')}
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                          Mark Seller as Rejected
                        </button>
                        <button
                          onClick={(e) => handleAction(e, 'not-possible')}
                          className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                          Mark Not Possible
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Open task details
              }}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors ml-auto"
            >
              <MoreHorizontal className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;