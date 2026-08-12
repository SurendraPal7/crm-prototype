const SummaryCard = ({ icon: Icon, number, label, supportText, variant = 'default', onClick }) => {
  const variants = {
    default: 'bg-white border-gray-200',
    danger: 'bg-white border-red-200',
    warning: 'bg-white border-orange-200',
    success: 'bg-white border-green-200',
  };

  const iconColors = {
    default: 'text-gray-500',
    danger: 'text-red-500',
    warning: 'text-orange-500',
    success: 'text-green-500',
  };

  const baseClasses = `p-4 sm:p-6 rounded-lg border ${variants[variant]} shadow-sm`;
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '';

  return (
    <div 
      className={`${baseClasses} ${clickableClasses}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
            {number}
          </div>
          <div className="text-sm font-medium text-gray-900 mb-1 truncate">
            {label}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {supportText}
          </div>
        </div>
        <div className="ml-2 sm:ml-4 flex-shrink-0">
          <Icon className={`w-4 sm:w-5 h-4 sm:h-5 ${iconColors[variant]}`} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;