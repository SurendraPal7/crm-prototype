import { AlertTriangle, Clock, Minus } from 'lucide-react';

const PriorityBadge = ({ priority, size = 'sm' }) => {
  const priorities = {
    P0: {
      label: 'Critical',
      icon: AlertTriangle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
    P1: {
      label: 'High Priority',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
    },
    P2: {
      label: 'Normal',
      icon: Minus,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
  };

  const config = priorities[priority] || priorities.P2;
  const Icon = config.icon;

  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-md font-medium border
        ${config.color} ${config.bg} ${config.border}
        ${sizeClasses[size]}
      `}
    >
      <Icon className={iconSizes[size]} />
      {priority}
    </span>
  );
};

export default PriorityBadge;