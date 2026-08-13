import { useState, useMemo } from 'react';
import { Users, Phone, AlertTriangle, Clock, CheckCircle, FolderOpen } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import FilterBar from '../components/FilterBar';
import SellerCard from '../components/SellerCard';
import TaskCard from '../components/TaskCard';
import TaskDrawer from '../components/TaskDrawer';
import CompleteTaskModal from '../components/CompleteTaskModal';
import BulkCompleteModal from '../components/BulkCompleteModal';
import PerformanceInsights from '../components/PerformanceInsights';
import BucketHealthCard from '../components/BucketHealthCard';
import PotentialSellerCard from '../components/PotentialSellerCard';
import { sellers } from '../data/sellers';
import { communications } from '../data/communications';
import { useTasks } from '../hooks/useTasks';
import { toast } from '../components/Toast';

const Cockpit = () => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    owner: 'all',
    sort: 'oldest-first',
  });
  
  const [selectedTaskDrawer, setSelectedTaskDrawer] = useState(null);
  const [completeTaskModal, setCompleteTaskModal] = useState(null);
  const [bulkCompleteModal, setBulkCompleteModal] = useState(false);
  const [activeSection, setActiveSection] = useState('callbacks');

  // Handle P1 Tasks card click
  const handleP1TasksClick = () => {
    setActiveSection('p1-tasks');
  };

  // Handle Callback Tasks card click
  const handleCallbackTasksClick = () => {
    setActiveSection('callbacks');
  };

  // Handle P0 Tasks card click
  const handleP0TasksClick = () => {
    setActiveSection('p0-tasks');
  };

  const {
    tasks,
    selectedTasks,
    summaryData,
    markTaskComplete,
    reassignTask,
    changePriority,
    toggleTaskSelection,
    selectAllTasks,
    clearSelection,
    bulkMarkComplete,
  } = useTasks();

  // Filter and sort sellers
  const filteredSellers = useMemo(() => {
    let filtered = [...sellers];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(search) ||
        seller.id.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [filters.search]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Filter by search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(search) ||
        task.id.toLowerCase().includes(search) ||
        task.type.toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'open':
          filtered = filtered.filter(task => task.status !== 'Closed');
          break;
        case 'overdue':
          filtered = filtered.filter(task => {
            if (task.status === 'Closed') return false;
            return new Date(task.dueAt) < new Date();
          });
          break;
        case 'due-today':
          filtered = filtered.filter(task => {
            if (task.status === 'Closed') return false;
            const today = new Date().toDateString();
            return new Date(task.dueAt).toDateString() === today;
          });
          break;
        case 'closed':
          filtered = filtered.filter(task => task.status === 'Closed');
          break;
      }
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Filter by owner
    if (filters.owner !== 'all') {
      if (filters.owner === 'my-tasks') {
        filtered = filtered.filter(task => task.owner.includes('Surendra'));
      } else {
        filtered = filtered.filter(task => task.ownerType === filters.owner);
      }
    }

    // Sort
    switch (filters.sort) {
      case 'newest-first':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'highest-priority':
        filtered.sort((a, b) => {
          const priorityOrder = { P0: 3, P1: 2, P2: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        });
        break;
      case 'due-soon':
        filtered.sort((a, b) => new Date(a.dueAt) - new Date(b.dueAt));
        break;
      default: // oldest-first
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return filtered;
  }, [tasks, filters]);

  // Get callback tasks specifically
  const callbackTasks = tasks.filter(task => 
    task.category === 'callback' && task.status !== 'Closed'
  );

  // Filter tasks by priority and group by seller
  const callbackSellers = useMemo(() => {
    const callbackTaskSellers = tasks.filter(task => task.category === 'callback' && task.status !== 'Closed');
    const sellerIds = [...new Set(callbackTaskSellers.map(task => task.sellerId))];
    let filtered = sellers.filter(seller => sellerIds.includes(seller.id));

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(search) ||
        seller.id.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [tasks, sellers, filters.search]);

  const p0Sellers = useMemo(() => {
    const p0TaskSellers = tasks.filter(task => task.priority === 'P0' && task.status !== 'Closed');
    const sellerIds = [...new Set(p0TaskSellers.map(task => task.sellerId))];
    let filtered = sellers.filter(seller => sellerIds.includes(seller.id));

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(search) ||
        seller.id.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [tasks, sellers, filters.search]);

  const p1Sellers = useMemo(() => {
    const p1TaskSellers = tasks.filter(task => task.priority === 'P1' && task.status !== 'Closed');
    const sellerIds = [...new Set(p1TaskSellers.map(task => task.sellerId))];
    let filtered = sellers.filter(seller => sellerIds.includes(seller.id));

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(search) ||
        seller.id.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [tasks, sellers, filters.search]);

  const p2Sellers = useMemo(() => {
    const p2TaskSellers = tasks.filter(task => task.priority === 'P2' && task.status !== 'Closed');
    const sellerIds = [...new Set(p2TaskSellers.map(task => task.sellerId))];
    let filtered = sellers.filter(seller => sellerIds.includes(seller.id));

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(search) ||
        seller.id.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [tasks, sellers, filters.search]);

  // Filter sellers for Bucket Health based on criteria
  const bucketHealthSellers = useMemo(() => {
    let filtered = sellers.filter(seller => {
      const performance = seller.performance;
      // Check if seller has the required bucket health fields
      if (!performance.pnlLastWeek || !performance.spend || !performance.pqScore) {
        return false;
      }
      
      // Exclude sellers who qualify as Potential Sellers (PnL >= 5%)
      if (performance.pnlLastWeek >= 5) {
        return false;
      }
      
      // Criteria: (PnL > -20% AND spend >= 3500) OR PQ score > 2.75
      const basicCriteria = performance.pnlLastWeek > -20 && performance.spend >= 3500;
      const pqCriteria = performance.pqScore > 2.75;
      
      return basicCriteria || pqCriteria;
    });

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(search) ||
        seller.id.toLowerCase().includes(search)
      );
    }
    
    // Sort by profitability (PnL) - highest first
    return filtered.sort((a, b) => b.performance.pnlLastWeek - a.performance.pnlLastWeek);
  }, [sellers, filters.search]);

  // Filter sellers for Potential Sellers based on criteria
  const potentialSellers = useMemo(() => {
    let filtered = sellers.filter(seller => {
      const performance = seller.performance;
      // Check if seller has the required fields
      if (!performance.pnlLastWeek || !performance.spend || !performance.pqScore) {
        return false;
      }
      
      // Primary criteria: If PnL >= 5%, check additional conditions
      if (performance.pnlLastWeek >= 5) {
        // Must also meet: (Spend >= 3500) OR (PQ Score > 2.75)
        const spendCriteria = performance.spend >= 3500;
        const pqCriteria = performance.pqScore > 2.75;
        return spendCriteria || pqCriteria;
      }
      
      return false; // If PnL < 5%, not a potential seller
    });

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(search) ||
        seller.id.toLowerCase().includes(search)
      );
    }
    
    // Sort by profitability (PnL) - highest first
    return filtered.sort((a, b) => b.performance.pnlLastWeek - a.performance.pnlLastWeek);
  }, [sellers, filters.search]);

  // Keep original task filters for counts and other functionality
  const p0Tasks = useMemo(() => {
    return tasks.filter(task => task.priority === 'P0' && task.status !== 'Closed');
  }, [tasks]);

  const p1Tasks = useMemo(() => {
    return tasks.filter(task => task.priority === 'P1' && task.status !== 'Closed');
  }, [tasks]);

  const p2Tasks = useMemo(() => {
    return tasks.filter(task => task.priority === 'P2' && task.status !== 'Closed');
  }, [tasks]);

  // Get sellers with P1 tasks due today
  const sellersWithP1DueToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    const p1TasksDueToday = tasks.filter(task => {
      if (task.status === 'Closed') return false;
      if (task.priority !== 'P1') return false;
      
      const taskDueDate = new Date(task.dueAt);
      taskDueDate.setHours(0, 0, 0, 0); // Reset time to start of day
      
      return taskDueDate.getTime() === today.getTime();
    });

    // Get unique seller IDs from P1 tasks due today
    const sellerIds = [...new Set(p1TasksDueToday.map(task => task.sellerId))];
    
    // Filter sellers who have P1 tasks due today
    let filtered = sellers.filter(seller => sellerIds.includes(seller.id));

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(search) ||
        seller.id.toLowerCase().includes(search)
      );
    }

    return filtered;
  }, [tasks, sellers, filters.search]);

  const handleSelectAllTasks = () => {
    let visibleTasks = [];
    
    switch (activeSection) {
      case 'callbacks':
        visibleTasks = callbackTasks;
        break;
      default:
        visibleTasks = callbackTasks;
    }
    
    const visibleTaskIds = visibleTasks.map(task => task.id);
    selectAllTasks(visibleTaskIds);
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

  const handleBulkComplete = async (remarks) => {
    const taskCount = selectedTasks.size;
    bulkMarkComplete(remarks);
    toast.success(`${taskCount} tasks marked as complete`);
  };

  const handleTaskComplete = (task) => {
    setCompleteTaskModal(task);
  };

  const handleConfirmComplete = async (taskId, remarks) => {
    markTaskComplete(taskId, remarks);
    toast.success('Task marked as complete');
  };

  const shouldShowEmptyState = () => {
    return (activeSection === 'p0-tasks' && p0Sellers.length === 0) ||
           (activeSection === 'p1-tasks' && p1Sellers.length === 0) ||
           (activeSection === 'p2-tasks' && p2Sellers.length === 0) ||
           (activeSection === 'callbacks' && callbackSellers.length === 0) ||
           (activeSection === 'bucket-health' && bucketHealthSellers.length === 0) ||
           (activeSection === 'potential-sellers' && potentialSellers.length === 0) ||
           (activeSection === 'p1-due-today' && sellersWithP1DueToday.length === 0);
  };

  const getEmptyStateMessage = () => {
    if (activeSection === 'bucket-health') {
      return 'No sellers currently meet the bucket health criteria (PnL > -20%, Spend >= Rs.3,500, PQ Score > 2.75).';
    }
    if (activeSection === 'potential-sellers') {
      return 'No sellers currently meet the potential seller criteria (PnL > 5%, Spend >= Rs.3,500, PQ Score > 2.75).';
    }
    return 'Try adjusting your search or filters to find what you are looking for.';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Cockpit</h1>
          <p className="text-sm sm:text-base text-gray-600">Seller Task Management Dashboard</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <SummaryCard
            icon={Users}
            number={sellers.length}
            label="Sellers"
            supportText={`${sellers.filter(s => s.openTasks > 0).length} with open tasks`}
          />
          <SummaryCard
            icon={Phone}
            number={summaryData.callbacks}
            label="Callback Tasks"
            supportText="callbacks"
            variant="warning"
            onClick={handleCallbackTasksClick}
          />
          <SummaryCard
            icon={AlertTriangle}
            number={summaryData.p0Tasks}
            label="P0 Tasks"
            supportText="escalations"
            variant="danger"
            onClick={handleP0TasksClick}
          />
          <SummaryCard
            icon={Clock}
            number={summaryData.p1Tasks}
            label="P1 Tasks"
            supportText="due today"
            variant="warning"
            onClick={handleP1TasksClick}
          />
          <SummaryCard
            icon={FolderOpen}
            number={summaryData.openTasks}
            label="Open Tasks"
            supportText="total pending"
          />
          <SummaryCard
            icon={CheckCircle}
            number={summaryData.closedToday}
            label="Done Today"
            supportText="closed today"
            variant="success"
          />
        </div>

        {/* Filter Bar */}
        <FilterBar filters={filters} onFilterChange={setFilters} />

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-3 sm:gap-6 mb-4 sm:mb-6 mt-6 sm:mt-8 overflow-x-auto">
          <button
            onClick={() => setActiveSection('callbacks')}
            className={`pb-2 border-b-2 font-medium text-base whitespace-nowrap ${
              activeSection === 'callbacks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Callbacks ({callbackSellers.length})
          </button>
          <button
            onClick={() => setActiveSection('p0-tasks')}
            className={`pb-2 border-b-2 font-medium text-base whitespace-nowrap ${
              activeSection === 'p0-tasks'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            P0 Tasks ({p0Tasks.length})
          </button>
          <button
            onClick={() => setActiveSection('p1-tasks')}
            className={`pb-2 border-b-2 font-medium text-base whitespace-nowrap ${
              activeSection === 'p1-tasks'
                ? 'border-orange-600 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            P1 Tasks ({p1Tasks.length})
          </button>
          <button
            onClick={() => setActiveSection('p2-tasks')}
            className={`pb-2 border-b-2 font-medium text-base whitespace-nowrap ${
              activeSection === 'p2-tasks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            P2 (Upcoming) ({p2Tasks.length})
          </button>
          <button
            onClick={() => setActiveSection('performance')}
            className={`pb-2 border-b-2 font-medium text-base whitespace-nowrap ${
              activeSection === 'performance'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Performance Insights ({sellers.length})
          </button>
          <button
            onClick={() => setActiveSection('bucket-health')}
            className={`pb-2 border-b-2 font-medium text-base whitespace-nowrap ${
              activeSection === 'bucket-health'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Bucket Health ({bucketHealthSellers.length})
          </button>
          <button
            onClick={() => setActiveSection('potential-sellers')}
            className={`pb-2 border-b-2 font-medium text-base whitespace-nowrap ${
              activeSection === 'potential-sellers'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Potential Sellers ({potentialSellers.length})
          </button>
          {activeSection === 'p1-due-today' && (
            <button
              onClick={() => setActiveSection('p1-due-today')}
              className="pb-2 border-b-2 border-orange-600 text-orange-600 font-medium text-base whitespace-nowrap"
            >
              P1 Due Today ({sellersWithP1DueToday.length})
            </button>
          )}
        </div>

        {/* Bulk Actions section removed since all sections now show seller cards */}

        {/* Content Sections */}
        {activeSection === 'p0-tasks' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                SELLERS WITH P0 TASKS
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {p0Sellers.length}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {p0Sellers.map(seller => (
                <SellerCard 
                  key={seller.id} 
                  seller={seller} 
                  communications={communications[seller.id] || []}
                  context="p0-tasks"
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'p1-tasks' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                SELLERS WITH P1 TASKS
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {p1Sellers.length}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {p1Sellers.map(seller => (
                <SellerCard 
                  key={seller.id} 
                  seller={seller} 
                  communications={communications[seller.id] || []}
                  context="p1-tasks"
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'p2-tasks' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                SELLERS WITH P2 (UPCOMING) TASKS
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {p2Sellers.length}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {p2Sellers.map(seller => (
                <SellerCard 
                  key={seller.id} 
                  seller={seller} 
                  communications={communications[seller.id] || []}
                  context="p2-tasks"
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'performance' && (
          <PerformanceInsights sellers={sellers} />
        )}


        {activeSection === 'bucket-health' && (
          <div>
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                BUCKET HEALTH SELLERS
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {bucketHealthSellers.length}
                </span>
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Sellers meeting criteria: (PnL &gt; -20% AND Spend &gt;= Rs.3,500) AND PQ Score &gt; 2.75
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {bucketHealthSellers.map(seller => (
                <BucketHealthCard 
                  key={seller.id} 
                  seller={seller} 
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'potential-sellers' && (
          <div>
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                POTENTIAL SELLERS
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {potentialSellers.length}
                </span>
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Sellers with PnL &gt;= 5% AND (Spend &gt;= Rs.3,500 and PQ Score &gt; 2.75)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {potentialSellers.map(seller => (
                <PotentialSellerCard 
                  key={seller.id} 
                  seller={seller} 
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'p1-due-today' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                SELLERS WITH P1 TASKS DUE TODAY
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {sellersWithP1DueToday.length}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellersWithP1DueToday.map(seller => (
                <SellerCard 
                  key={seller.id} 
                  seller={seller} 
                  communications={communications[seller.id] || []}
                  context="p1-due-today"
                />
              ))}
            </div>
          </div>
        )}

        {activeSection === 'callbacks' && (
          <div>
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                SELLERS WITH CALLBACK TASKS
                <span className="ml-2 text-sm font-normal text-gray-500">
                  {callbackSellers.length}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {callbackSellers.map(seller => (
                <SellerCard 
                  key={seller.id} 
                  seller={seller} 
                  communications={communications[seller.id] || []}
                  context="callbacks"
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {shouldShowEmptyState() && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FolderOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">
              {getEmptyStateMessage()}
            </p>
          </div>
        )}
      </div>

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

export default Cockpit;