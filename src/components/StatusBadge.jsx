const StatusBadge = ({ status, dueAt }) => {
  const getStatusInfo = () => {
    const now = new Date();
    const due = new Date(dueAt);
    const diffInHours = (due - now) / (1000 * 60 * 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (status === 'Closed') {
      return {
        text: 'Completed',
        variant: 'success',
      };
    }

    if (diffInHours < 0) {
      const overdueDays = Math.abs(diffInDays);
      return {
        text: overdueDays === 0 ? 'Overdue' : `Overdue by ${overdueDays} day${overdueDays > 1 ? 's' : ''}`,
        variant: 'danger',
      };
    }

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        return {
          text: 'Due soon',
          variant: 'warning',
        };
      }
      const hours = Math.floor(diffInHours);
      return {
        text: hours === 0 ? 'Due now' : `Due in ${hours}h`,
        variant: 'warning',
      };
    }

    return {
      text: 'PENDING',
      variant: 'default',
    };
  };

  const { text, variant } = getStatusInfo();

  const variants = {
    success: 'bg-green-50 text-green-700 border-green-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-orange-50 text-orange-700 border-orange-200',
    default: 'bg-blue-100 text-blue-700 border-blue-200', // Light blue background with blue text for PENDING
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {text}
    </span>
  );
};

export default StatusBadge;