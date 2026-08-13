import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

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

  // Get Spend/GMV color based on performance thresholds
  const getSpendGMVColor = (spendGMVRatio) => {
    if (spendGMVRatio < 20) {
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        labelColor: 'text-green-700'
      };
    } else if (spendGMVRatio >= 20 && spendGMVRatio <= 50) {
      return {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        labelColor: 'text-yellow-700'
      };
    } else {
      return {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        labelColor: 'text-red-700'
      };
    }
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  // Get trend icon and color for comparison
  const getTrendIndicator = (lastWeek, currentWeek, isSpendGMV = true) => {
    const diff = currentWeek - lastWeek;
    // For Spend/GMV, lower is better. For RTO, lower is also better.
    const isImprovement = diff < 0;
    const isWorsening = diff > 0;
    
    if (Math.abs(diff) < 0.1) {
      return {
        icon: <Minus className="w-3 h-3" />,
        color: 'text-gray-500',
        bgColor: 'bg-gray-100'
      };
    }
    
    if (isImprovement) {
      return {
        icon: <TrendingDown className="w-3 h-3" />,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      };
    }
    
    return {
      icon: <TrendingUp className="w-3 h-3" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    };
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Seller Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {rankedSellers.map((seller) => {
          const performance = getPerformanceLevel(seller.performance.performanceScore);
          const spendGMVColors = getSpendGMVColor(seller.performance.spendGMVRatio.currentWeek);
          const spendTrend = getTrendIndicator(
            seller.performance.spendGMVRatio.lastWeek,
            seller.performance.spendGMVRatio.currentWeek,
            true
          );
          const rtoTrend = getTrendIndicator(
            seller.performance.rtoPercentage.lastWeek,
            seller.performance.rtoPercentage.currentWeek,
            false
          );
          
          return (
            <div
              key={seller.id}
              className={`${performance.cardBg} rounded-lg border ${performance.borderColor} p-4 sm:p-6 hover:shadow-md transition-shadow`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">{seller.name}</h3>
                    {seller.tag && (
                      <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded self-start">
                        {seller.tag}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 truncate">ID: {seller.id.slice(-15)}</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="space-y-3">
                {/* Spend/GMV */}
                <div className={`${spendGMVColors.bgColor} rounded-lg border ${spendGMVColors.borderColor} p-3`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-base font-medium ${spendGMVColors.labelColor}`}>Spend/GMV</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${spendTrend.bgColor}`}>
                      <span className={`${spendTrend.color}`}>
                        {spendTrend.icon}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Current Week</div>
                      <div className={`text-base font-semibold ${spendGMVColors.textColor}`}>
                        {formatPercentage(seller.performance.spendGMVRatio.currentWeek)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Last Week</div>
                      <div className="text-base font-semibold text-gray-700">
                        {formatPercentage(seller.performance.spendGMVRatio.lastWeek)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* RTO */}
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-medium text-gray-700">RTO</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${rtoTrend.bgColor}`}>
                      <span className={`${rtoTrend.color}`}>
                        {rtoTrend.icon}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Current Week</div>
                      <div className="text-base font-semibold text-gray-900">
                        {formatPercentage(seller.performance.rtoPercentage.currentWeek)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Last Week</div>
                      <div className="text-base font-semibold text-gray-700">
                        {formatPercentage(seller.performance.rtoPercentage.lastWeek)}
                      </div>
                    </div>
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