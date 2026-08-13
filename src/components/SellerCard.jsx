import { Phone, Eye, Clock, AlertCircle, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from './Toast';

const SellerCard = ({ seller, communications = [], context = 'general' }) => {
  const handleCallSeller = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info(`Call initiated to ${seller.name}`);
  };

  const communicationCount = communications.length;

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

  // Create URL with context parameter
  const getSellerUrl = () => {
    return `/seller/${seller.id}?context=${context}`;
  };

  return (
    <Link to={getSellerUrl()} className="block">
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                {seller.name}
              </h3>
              {seller.tag && (
                <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-medium border border-blue-600 self-start">
                  {seller.tag}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-3">
              ID: {seller.id}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
              <span className="text-gray-500">Open Tasks:</span>
              <span className="font-semibold text-gray-900">{seller.openTasks}</span>
            </div>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm">
              <span className="text-gray-500">Overdue:</span>
              <span className={`font-semibold ${seller.overdueTasks > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {seller.overdueTasks}
              </span>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">Messages:</span>
              <span className="font-semibold text-gray-900">{communicationCount}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Last contact: {getLastContactText()}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {seller.overdueTasks > 0 && (
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCallSeller}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <Phone className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">Call</span>
              </button>
              <button className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap">
                <Eye className="w-3 sm:w-4 h-3 sm:h-4" />
                <span className="hidden sm:inline">View</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SellerCard;