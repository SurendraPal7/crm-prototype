import { useMemo } from 'react';

const PerformanceInsights = ({ sellers }) => {
  // Sort sellers by performance score
  const rankedSellers = useMemo(() => {
    return [...sellers].sort((a, b) => b.performance.performanceScore - a.performance.performanceScore);
  }, [sellers]);

  // Get performance level and color
  const getPerformanceLevel = (score) => {
    if (score >= 85) return { 
      level: 'Excellent', 
      bgColor: 'bg-green-50', 
      borderColor: 'border-green-200',
      cardBg: 'bg-green-50'
    };
    if (score >= 70) return { 
      level: 'Good', 
      bgColor: 'bg-yellow-50', 
      borderColor: 'border-yellow-200',
      cardBg: 'bg-yellow-50'
    };
    return { 
      level: 'Needs Improvement', 
      bgColor: 'bg-red-50', 
      borderColor: 'border-red-200',
      cardBg: 'bg-red-50'
    };
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    return `${diffInDays} days ago`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Seller Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {rankedSellers.map((seller) => {
          const performance = getPerformanceLevel(seller.performance.performanceScore);
          
          return (
            <div
              key={seller.id}
              className={`${performance.cardBg} rounded-lg border ${performance.borderColor} p-4 sm:p-6 hover:shadow-md transition-shadow`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{seller.name}</h3>
                    {seller.tag && (
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded self-start">
                        {seller.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate">ID: {seller.id.slice(-15)}</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 gap-2 sm:gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Spend/GMV:</span>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">{formatPercentage(seller.performance.spendGMVRatio)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">RTO:</span>
                  <span className="font-semibold text-gray-900 text-xs sm:text-sm">{formatPercentage(seller.performance.rtoPercentage)}</span>
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