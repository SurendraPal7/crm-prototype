import React from 'react';

const BucketHealthCard = ({ seller }) => {
  const { name, id, tag, performance } = seller;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-300 p-3 sm:p-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 line-clamp-2">
              {name}
            </h3>
            {tag && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium border border-blue-600 self-start">
                {tag}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">
            ID: {id}
          </p>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-t border-gray-300 mb-3"></div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
            <span className="text-gray-500">Last Week PnL:</span>
            <span className={`font-semibold text-base ${performance.pnlLastWeek >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {performance.pnlLastWeek}%
            </span>
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
            <span className="text-gray-500">Week-2 PnL:</span>
            <span className={`font-semibold text-base ${performance.pnlWeek2 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {performance.pnlWeek2}%
            </span>
          </div>
          <div className="border-t border-gray-200 mt-2"></div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
            <span className="text-gray-500">Last Week Spend:</span>
            <span className="font-semibold text-base text-gray-900">
              ₹{formatCurrency(performance.spend)}
            </span>
          </div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
            <span className="text-gray-500">Week-2 Spend:</span>
            <span className="font-semibold text-base text-gray-900">
              ₹{formatCurrency(performance.spendWeek2)}
            </span>
          </div>
          <div className="border-t border-gray-200 mt-2"></div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
            <span className="text-gray-500">Last Week Spend/GMV:</span>
            <span className="font-semibold text-base text-gray-900">
              {performance.spendGMVLastWeek}%
            </span>
          </div>
          <div className="border-t border-gray-200 mt-2"></div>
        </div>

        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
            <span className="text-gray-500">PQ Score:</span>
            <span className={`font-semibold text-base ${performance.pqScore >= 3.0 ? 'text-green-600' : 'text-blue-600'}`}>
              {performance.pqScore.toFixed(1)}
            </span>
          </div>
        </div>
        
        {/* PQ Score Improvement Reminder */}
        {performance.pqScore <= 2.75 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-medium text-yellow-800">
                Please improve PQ Score to above 2.75
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BucketHealthCard;