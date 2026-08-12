import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

const AISummary = ({ sellerId, summaryData }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [checkedItems, setCheckedItems] = useState(new Set());

  if (!summaryData) return null;

  const { issueCount, issues, checklist } = summaryData;

  const toggleCheck = (index) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'P0': return 'text-red-500';
      case 'P1': return 'text-orange-500';
      case 'P2': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Summary</h3>
            <p className="text-sm text-gray-600">
              {issueCount} issue{issueCount !== 1 ? 's' : ''} require attention
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-gray-100 pt-4">
            {/* Issues */}
            <div className="space-y-3 mb-6">
              {issues.map((issue) => (
                <div key={issue.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <span className="text-lg">{issue.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{issue.title}</h4>
                      <span className={`text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{issue.age}</p>
                    <p className="text-sm text-gray-700">
                      <strong>Action:</strong> {issue.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Before You Dial Checklist */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="text-sm font-semibold text-blue-900 mb-3">BEFORE YOU DIAL</h4>
              <div className="space-y-2">
                {checklist.map((item, index) => (
                  <label key={index} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(index)}
                      onChange={() => toggleCheck(index)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className={`text-sm ${checkedItems.has(index) ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISummary;