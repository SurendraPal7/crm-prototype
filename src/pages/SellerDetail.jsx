import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Phone, MessageSquare, X } from 'lucide-react';
import AISummary from '../components/AISummary';
import TaskCard from '../components/TaskCard';
import TaskDrawer from '../components/TaskDrawer';
import CompleteTaskModal from '../components/CompleteTaskModal';
import BulkCompleteModal from '../components/BulkCompleteModal';
import CommunicationPanel from '../components/CommunicationPanel';
import { sellers } from '../data/sellers';
import { tasks, aiSummaryData } from '../data/tasks';
import { communications, pocList } from '../data/communications';
import { useTasks } from '../hooks/useTasks';
import { toast } from '../components/Toast';

const SellerDetail = () => {
  const { sellerId } = useParams();
  const [searchParams] = useSearchParams();
  const context = searchParams.get('context');
  
  // Set initial active tab based on context
  const getInitialTab = () => {
    switch (context) {
      case 'callbacks': return 'callbacks';
      case 'p0-tasks': return 'P0';
      case 'p1-tasks': return 'P1';
      case 'p2-tasks': return 'P2';
      case 'p1-due-today': return 'P1';
      default: return 'callbacks';
    }
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [selectedTaskDrawer, setSelectedTaskDrawer] = useState(null);
  const [completeTaskModal, setCompleteTaskModal] = useState(null);
  const [bulkCompleteModal, setBulkCompleteModal] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);

  const {
    tasks: allTasks,
    selectedTasks,
    markTaskComplete,
    reassignTask,
    changePriority,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    bulkMarkComplete,
  } = useTasks();

  // Update active tab when context changes
  useEffect(() => {
    setActiveTab(getInitialTab());
  }, [context]);

  // Find the seller
  const seller = sellers.find(s => s.id === sellerId);
  
  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Seller not found</h1>
          <Link to="/cockpit" className="text-blue-600 hover:text-blue-700">
            ← Back to Cockpit
          </Link>
        </div>
      </div>
    );
  }

  // Filter tasks for this seller
  const sellerTasks = allTasks.filter(task => task.sellerId === sellerId);
  
  // Get seller communications
  const sellerCommunications = communications[sellerId] || [];

  // Group tasks by category and status
  const tasksByCategory = useMemo(() => {
    const categories = {
      callbacks: sellerTasks.filter(task => task.category === 'callback' && task.status !== 'Closed'),
      P0: sellerTasks.filter(task => task.priority === 'P0' && task.status !== 'Closed'),
      P1: sellerTasks.filter(task => task.priority === 'P1' && task.status !== 'Closed'),
      P2: sellerTasks.filter(task => task.priority === 'P2' && task.status !== 'Closed'),
      closed: sellerTasks.filter(task => task.status === 'Closed'),
    };

    // Apply owner filter
    if (ownerFilter !== 'all') {
      Object.keys(categories).forEach(key => {
        if (ownerFilter === 'my-tasks') {
          categories[key] = categories[key].filter(task => task.owner.includes('Surendra'));
        } else {
          categories[key] = categories[key].filter(task => task.ownerType === ownerFilter);
        }
      });
    }

    return categories;
  }, [sellerTasks, ownerFilter]);

  const currentTasks = tasksByCategory[activeTab] || [];

  const handleCallSeller = () => {
    toast.info(`Call initiated to ${seller.name}`);
  };

  const getLastContactText = () => {
    const lastContact = new Date(seller.lastContact);
    const now = new Date();
    const diffInHours = (now - lastContact) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return 'Today';
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days} days ago`;
    }
  };

  const handleSelectAllTasks = () => {
    const visibleTaskIds = currentTasks.map(task => task.id);
    selectAllTasks(visibleTaskIds);
  };

  const handleTaskComplete = (task) => {
    setCompleteTaskModal(task);
  };

  const handleBulkComplete = async (remarks) => {
    const taskCount = selectedTasks.size;
    bulkMarkComplete(remarks);
    toast.success(`${taskCount} tasks marked as complete`);
  };

  const handleBulkAction = (action) => {
    switch (action) {
      case 'complete':
        setBulkCompleteModal(true);
        break;
      case 'reassign':
        toast.info('Bulk reassignment feature coming soon');
        break;
      case 'reject':
        if (window.confirm(`Mark ${selectedTasks.size} seller(s) as rejected?`)) {
          toast.info(`${selectedTasks.size} seller(s) marked as rejected`);
          clearSelection();
        }
        break;
      case 'not-possible':
        if (window.confirm(`Mark ${selectedTasks.size} task(s) as not possible?`)) {
          toast.info(`${selectedTasks.size} task(s) marked as not possible`);
          clearSelection();
        }
        break;
      default:
        break;
    }
  };

  const handleConfirmComplete = async (taskId, remarks) => {
    markTaskComplete(taskId, remarks);
    toast.success('Task marked as complete');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${showCommunication ? 'lg:mr-[480px]' : ''}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Link 
                  to="/cockpit"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Cockpit</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                <button
                  onClick={() => setShowCommunication(!showCommunication)}
                  className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md transition-colors text-sm ${
                    showCommunication 
                      ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                      : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  <MessageSquare className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">{showCommunication ? 'Hide Chat' : 'Show Chat'}</span>
                  <span className="sm:hidden">Chat</span>
                </button>
                <button
                  onClick={handleCallSeller}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Phone className="w-3 sm:w-4 h-3 sm:h-4" />
                  <span className="hidden sm:inline">Call Seller</span>
                  <span className="sm:hidden">Call</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{seller.name}</h1>
                  {seller.tag && (
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium border border-blue-600 self-start">
                      {seller.tag}
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-2">Seller ID: {seller.id}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 lg:min-w-[280px]">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Open Tasks</p>
                    <p className="text-lg sm:text-xl font-semibold text-gray-900">{seller.openTasks}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Overdue</p>
                    <p className={`text-lg sm:text-xl font-semibold ${seller.overdueTasks > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {seller.overdueTasks}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500">Last Contact:</span>
                      <span className="font-medium text-gray-900 truncate">{getLastContactText()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500">Communications:</span>
                      <span className="font-medium text-gray-900">{sellerCommunications.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="mb-4 sm:mb-6">
          <AISummary 
            sellerId={sellerId} 
            summaryData={aiSummaryData[sellerId]} 
          />
        </div>

        {/* Task Management */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 sm:p-6">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-3 sm:gap-6 mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
              {Object.entries(tasksByCategory).map(([key, tasks]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`pb-3 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                    activeTab === key
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {key === 'callbacks' ? 'Callbacks' : key.toUpperCase()} ({tasks.length})
                </button>
              ))}
            </div>

            {/* Owner Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
              <span className="text-sm font-medium text-gray-900 mb-1 sm:mb-0">Owner:</span>
              {['all', 'my-tasks', 'GM', 'GC', 'KAM', 'KAE', 'Ops'].map(owner => (
                <button
                  key={owner}
                  onClick={() => setOwnerFilter(owner)}
                  className={`px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                    ownerFilter === owner
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {owner === 'all' ? 'All' : owner === 'my-tasks' ? 'My Tasks' : owner}
                </button>
              ))}
            </div>

            {/* Bulk Actions */}
            {currentTasks.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 sm:gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTasks.size > 0 && selectedTasks.size === currentTasks.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSelectAllTasks();
                        } else {
                          clearSelection();
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Select all shown</span>
                  </label>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                  <span className="text-sm text-gray-500">
                    {selectedTasks.size > 0 && `${selectedTasks.size} selected`}
                  </span>
                  {selectedTasks.size > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleBulkAction('complete')}
                        className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 whitespace-nowrap"
                      >
                        Mark Complete
                      </button>
                      
                      {/* Bulk Actions Dropdown */}
                      <div className="relative">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleBulkAction(e.target.value);
                              e.target.value = '';
                            }
                          }}
                          className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-gray-50 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                        >
                          <option value="">More Actions</option>
                          <option value="reassign">Re-assign Tasks</option>
                          <option value="reject">Mark Sellers as Rejected</option>
                          <option value="not-possible">Mark Not Possible</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Task List */}
            <div className="space-y-3 sm:space-y-4">
              {currentTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isSelected={selectedTasks.has(task.id)}
                  onToggleSelect={toggleTaskSelection}
                  onMarkComplete={handleTaskComplete}
                  onViewDetails={setSelectedTaskDrawer}
                />
              ))}
            </div>

            {/* Empty State */}
            {currentTasks.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <div className="text-gray-400 mb-2">No {activeTab} tasks found</div>
                <p className="text-sm text-gray-500">
                  {ownerFilter !== 'all' ? 'Try changing the owner filter.' : 'All tasks in this category have been completed.'}
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Communication Panel */}
      {showCommunication && (
        <>
          {/* Mobile Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-20 lg:hidden"
            onClick={() => setShowCommunication(false)}
          />
          
          {/* Communication Panel - Fixed Position */}
          <div className="fixed right-0 top-0 z-30 w-full max-w-sm lg:max-w-none lg:w-[480px] h-full">
            <CommunicationPanel 
              sellerId={sellerId}
              communications={sellerCommunications}
              pocList={pocList}
              currentUser="GC Surendra Pal"
              sellerName={seller.name}
            />
          </div>
        </>
      )}

      {/* Task Drawer */}
      <TaskDrawer
        task={selectedTaskDrawer}
        isOpen={!!selectedTaskDrawer}
        onClose={() => setSelectedTaskDrawer(null)}
        onMarkComplete={handleTaskComplete}
        onReassign={reassignTask}
        onChangePriority={changePriority}
      />

      {/* Complete Task Modal */}
      <CompleteTaskModal
        task={completeTaskModal}
        isOpen={!!completeTaskModal}
        onClose={() => setCompleteTaskModal(null)}
        onConfirm={handleConfirmComplete}
      />

      {/* Bulk Complete Modal */}
      <BulkCompleteModal
        taskCount={selectedTasks.size}
        isOpen={bulkCompleteModal}
        onClose={() => setBulkCompleteModal(false)}
        onConfirm={handleBulkComplete}
      />
    </div>
  );
};

export default SellerDetail;