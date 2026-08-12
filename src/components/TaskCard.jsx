import { Phone, Eye, MoreHorizontal, ChevronDown } from 'lucide-react';
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

  const getOwnerDisplay = () => {
    return `${task.ownerType} ${task.owner.split(' ').pop()}`;
  };

  return (
    <div 
      className={`
        bg-white rounded-lg border p-3 sm:p-4 transition-all cursor-pointer
        ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
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
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                <span className="text-sm font-medium text-gray-500">#{task.id}</span>
                <PriorityBadge priority={task.priority} size="xs" />
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                {task.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {task.type}
              </p>
              
              {/* Seller Information */}
              <div className="space-y-1 mb-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                  <span className="text-gray-500">Seller ID:</span>
                  <span className="text-gray-700 font-medium break-all">{task.sellerId}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                  <span className="text-gray-500">Seller Name:</span>
                  <span className="text-gray-700 font-medium truncate">{sellerName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <StatusBadge status={task.status} dueAt={task.dueAt} />
            <span className="text-xs sm:text-sm text-gray-500 truncate">
              Owner: {getOwnerDisplay()}
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <div className="flex items-center gap-2 flex-wrap">
              {task.status !== 'Closed' && (
                <>
                  <button
                    onClick={handleCallSeller}
                    className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                    Call
                  </button>
                  
                  {/* Take Action Dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(!showActionMenu);
                      }}
                      className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors whitespace-nowrap"
                    >
                      Take Action
                      <ChevronDown className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
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
                        <div className="absolute right-0 bottom-full mb-1 w-40 sm:w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            onClick={(e) => handleAction(e, 'complete')}
                            className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                            <span className="truncate">Mark as Done</span>
                          </button>
                          <button
                            onClick={(e) => handleAction(e, 'reassign')}
                            className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <span className="truncate">Re-assign Task</span>
                          </button>
                          <button
                            onClick={(e) => handleAction(e, 'reject')}
                            className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                            <span className="truncate">Mark Seller as Rejected</span>
                          </button>
                          <button
                            onClick={(e) => handleAction(e, 'not-possible')}
                            className="w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                            <span className="truncate">Mark Not Possible</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                // Open task details
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors self-end sm:self-auto"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;