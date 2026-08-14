import { Phone, MoreHorizontal, ChevronDown, ChevronRight, Check, Square, Calendar, User } from 'lucide-react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubtasks, setSelectedSubtasks] = useState(new Set());

  // Get seller information
  const seller = sellers.find(s => s.id === task.sellerId);

  const handleCallSeller = (e) => {
    e.stopPropagation();
    toast.info('Call initiated');
  };

  const handleAction = (e, action, targetTask = task) => {
    e.stopPropagation();
    setShowActionMenu(false);
    
    switch (action) {
      case 'complete':
        onMarkComplete(targetTask);
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
      year: 'numeric'
    });
  };

  // Handle subtask selection
  const handleSubtaskSelect = (subtaskId, checked) => {
    const newSelected = new Set(selectedSubtasks);
    if (checked) {
      newSelected.add(subtaskId);
    } else {
      newSelected.delete(subtaskId);
    }
    setSelectedSubtasks(newSelected);
  };

  // Handle select all subtasks
  const handleSelectAllSubtasks = () => {
    const pendingSubtasks = task.subtasks?.filter(st => st.status === 'Pending') || [];
    if (selectedSubtasks.size === pendingSubtasks.length && selectedSubtasks.size > 0) {
      // Deselect all
      setSelectedSubtasks(new Set());
    } else {
      // Select all pending subtasks
      setSelectedSubtasks(new Set(pendingSubtasks.map(st => st.id)));
    }
  };

  // Handle bulk complete selected subtasks
  const handleBulkCompleteSubtasks = () => {
    if (selectedSubtasks.size > 0) {
      selectedSubtasks.forEach(subtaskId => {
        const subtask = task.subtasks.find(st => st.id === subtaskId);
        if (subtask) {
          handleAction({ stopPropagation: () => {} }, 'complete', subtask);
        }
      });
      setSelectedSubtasks(new Set());
      toast.success(`Completed ${selectedSubtasks.size} subtasks`);
    }
  };

  const getOverdueDays = () => {
    if (task.status === 'Closed' || task.status === 'Completed') return null;
    const today = new Date();
    const dueDate = new Date(task.dueAt);
    const diffTime = today - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  };

  // Get completed subtasks count
  const completedSubtasksCount = task.subtasks?.filter(st => st.status === 'Completed').length || 0;
  // Check if all subtasks are completed
  const allSubtasksCompleted = task.subtasks?.every(st => st.status === 'Completed') || false;

  const overdueDays = getOverdueDays();

  // Parent Task Component
  if (task.isParentTask) {
    return (
      <div className={`
        bg-white rounded-lg border border-gray-300 p-3 sm:p-4 transition-all
        ${isSelected ? 'border-blue-500 bg-blue-50' : ''}
        ${allSubtasksCompleted ? 'opacity-75' : ''}
      `}>
        {/* Parent Task Header */}
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

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            {/* Header with Category Tag */}
            <div className="mb-2">
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-medium border border-purple-200">
                PARENT TASK
              </span>
            </div>

            {/* Task Title */}
            <div className="mb-3">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                {task.id}-{task.title}
              </h2>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-gray-600">
                {completedSubtasksCount}/{task.subtasks?.length || 0} subtasks completed
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-32">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${task.subtasks?.length ? (completedSubtasksCount / task.subtasks.length) * 100 : 0}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Created Date */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-700">
                Created on: {formatDate(task.createdAt)} | Due: {formatDate(task.dueAt)}
              </p>
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
                
                {overdueDays && !allSubtasksCompleted && (
                  <div className="text-red-500 font-medium text-xs">
                    Overdue By {overdueDays} Days
                  </div>
                )}
              </div>
              
              <StatusBadge status={allSubtasksCompleted ? 'Completed' : task.status} />
            </div>

            {/* Parent Task Actions */}
            {!allSubtasksCompleted && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleCallSeller}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  Call
                </button>
                
                {allSubtasksCompleted && (
                  <button
                    onClick={(e) => handleAction(e, 'complete')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Complete Parent Task
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Subtasks */}
        {isExpanded && task.subtasks && (
          <div className="ml-8 mt-4 space-y-3 border-t border-gray-100 pt-4">
            {/* Bulk Actions for Subtasks */}
            {task.subtasks.some(st => st.status === 'Pending') && (
              <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                <button
                  onClick={handleSelectAllSubtasks}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  {selectedSubtasks.size === task.subtasks.filter(st => st.status === 'Pending').length && selectedSubtasks.size > 0 ? (
                    <Check className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  Select All Pending
                </button>
                {selectedSubtasks.size > 0 && (
                  <button
                    onClick={handleBulkCompleteSubtasks}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Complete Selected ({selectedSubtasks.size})
                  </button>
                )}
              </div>
            )}

            {/* Individual Subtasks */}
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                {/* Checkbox for pending subtasks */}
                {subtask.status === 'Pending' && (
                  <button
                    onClick={() => handleSubtaskSelect(subtask.id, !selectedSubtasks.has(subtask.id))}
                    className="mt-1 flex-shrink-0"
                  >
                    {selectedSubtasks.has(subtask.id) ? (
                      <Check className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                )}
                {subtask.status === 'Completed' && (
                  <Check className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-xs">
                      {subtask.category}
                    </span>
                    <PriorityBadge priority={subtask.priority} size="sm" />
                  </div>
                  
                  <h4 className={`text-sm font-medium mb-1 ${
                    subtask.status === 'Completed' ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {subtask.id}-{subtask.title}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Due: {formatDate(subtask.dueAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{subtask.ownerType} {subtask.owner.split(' ').pop()}</span>
                    </div>
                  </div>

                  <StatusBadge status={subtask.status} />
                </div>

                {/* Subtask Actions */}
                {subtask.status === 'Pending' && (
                  <button
                    onClick={(e) => handleAction(e, 'complete', subtask)}
                    className="text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs font-medium transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular Task (existing functionality)
  return (
    <div 
      className={`
        bg-white rounded-lg border border-gray-300 p-3 sm:p-4 transition-all cursor-pointer hover:shadow-md
        ${isSelected ? 'border-blue-500 bg-blue-50' : ''}
        ${task.status === 'Closed' || task.status === 'Completed' ? 'opacity-75' : ''}
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
              Created on: {formatDate(task.createdAt)} | Due: {formatDate(task.dueAt)}
            </p>
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
            
            <StatusBadge status={task.status} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {task.status !== 'Closed' && task.status !== 'Completed' && (
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