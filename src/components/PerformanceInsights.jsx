import { useMemo, useState } from 'react';

const PerformanceInsights = ({ sellers }) => {
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'live', 'paused'

  // Sort sellers by performance score and filter by status
  const rankedSellers = useMemo(() => {
    let filteredSellers = [...sellers];
    
    // Apply status filter
    if (statusFilter === 'live') {
      filteredSellers = filteredSellers.filter(seller => seller.performance.accountStatus === 'Live');
    } else if (statusFilter === 'paused') {
      filteredSellers = filteredSellers.filter(seller => seller.performance.accountStatus === 'Paused');
    }
    
    return filteredSellers.sort((a, b) => b.performance.performanceScore - a.performance.performanceScore);
  }, [sellers, statusFilter]);

  // Calculate counts for filter buttons
  const counts = useMemo(() => {
    const liveCount = sellers.filter(seller => seller.performance.accountStatus === 'Live').length;
    const pausedCount = sellers.filter(seller => seller.performance.accountStatus === 'Paused').length;
    const totalCount = sellers.length;
    
    return { liveCount, pausedCount, totalCount };
  }, [sellers]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            statusFilter === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          All Sellers ({counts.totalCount})
        </button>
        <button
          onClick={() => setStatusFilter('live')}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            statusFilter === 'live'
              ? 'bg-green-100 text-green-800 border-green-200'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Live Only ({counts.liveCount})
        </button>
        <button
          onClick={() => setStatusFilter('paused')}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            statusFilter === 'paused'
              ? 'bg-orange-100 text-orange-800 border-orange-200'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Paused Only ({counts.pausedCount})
        </button>
      </div>

      {/* Seller Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {rankedSellers.map((seller) => {
          return (
            <div
              key={seller.id}
              className="bg-white rounded-lg border border-gray-300 p-3 sm:p-4 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2">
                      {seller.name}
                    </h3>
                    {seller.performance.accountStatus && (
                      <span className={`px-3 py-1 text-xs font-medium rounded-lg ${
                        seller.performance.accountStatus === 'Live' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-orange-100 text-orange-800 border border-orange-200'
                      } self-start`}>
                        {seller.performance.accountStatus}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    ID: {seller.id}
                  </p>
                </div>
              </div>

              {/* Divider Line */}
              <div className="border-t border-gray-300 mb-3"></div>

              {/* Metrics */}
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                    <span className="text-gray-500">Current Week Spend/GMV:</span>
                    <span className="font-semibold text-base text-gray-900">
                      {seller.performance.spendGMVRatio.currentWeek}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                    <span className="text-gray-500">Current Week Spend:</span>
                    <span className="font-semibold text-base text-gray-900">
                      ₹{formatCurrency(seller.performance.weeklySpend?.currentWeek || seller.performance.adSpend || 0)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                    <span className="text-gray-500">Current Week RTO:</span>
                    <span className="font-semibold text-base text-gray-900">
                      {seller.performance.rtoPercentage.currentWeek}%
                    </span>
                  </div>
                  <div className="border-t border-gray-200 mt-2"></div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                    <span className="text-gray-500">Last Week Spend/GMV:</span>
                    <span className="font-semibold text-base text-gray-900">
                      {seller.performance.spendGMVRatio.lastWeek}%
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                    <span className="text-gray-500">Last Week Spend:</span>
                    <span className="font-semibold text-base text-gray-900">
                      ₹{formatCurrency(seller.performance.weeklySpend?.lastWeek || seller.performance.adSpend || 0)}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
                    <span className="text-gray-500">Last Week RTO:</span>
                    <span className="font-semibold text-base text-gray-900">
                      {seller.performance.rtoPercentage.lastWeek}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceInsights;