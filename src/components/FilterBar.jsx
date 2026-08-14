import { Search, Filter, Users, ArrowUpDown, RefreshCw } from 'lucide-react';
import { toast } from './Toast';

const FilterBar = ({ filters, onFilterChange }) => {
  const handleResetFilters = () => {
    const resetFilters = {
      search: '',
      status: 'all',
      priority: 'all',
      owner: 'all',
      sort: 'oldest-first',
    };
    onFilterChange(resetFilters);
    toast.info('Filters reset');
  };
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Left side - Search */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search sellers, task ID, or task title..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {/* Right side - Filters and Actions */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.status || 'all'}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="overdue">Overdue</option>
              <option value="due-today">Due Today</option>
              <option value="closed">Closed</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.priority || 'all'}
              onChange={(e) => onFilterChange({ ...filters, priority: e.target.value })}
            >
              <option value="all">All Priority</option>
              <option value="P0">P0</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Owner Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.owner || 'all'}
              onChange={(e) => onFilterChange({ ...filters, owner: e.target.value })}
            >
              <option value="all">All Owners</option>
              <option value="my-tasks">My Tasks</option>
              <option value="GC">GC</option>
              <option value="GM">GM</option>
              <option value="KAM">KAM</option>
              <option value="KAE">KAE</option>
              <option value="Ops">Ops</option>
            </select>
            <Users className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative">
            <select
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.sort || 'oldest-first'}
              onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
            >
              <option value="oldest-first">Oldest First</option>
              <option value="newest-first">Newest First</option>
              <option value="highest-priority">Highest Priority</option>
              <option value="due-soon">Due Soon</option>
            </select>
            <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Reset Button and Filter Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => toast.success('Filters are applied in real-time')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Apply Filter
            </button>
            
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;