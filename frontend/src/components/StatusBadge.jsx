import React from 'react';

const StatusBadge = ({ status, type = 'cow' }) => {
  const normalized = (status || '').toLowerCase();

  let colorClasses = 'bg-stone-100 text-stone-700 border-stone-300';
  let label = status;

  if (type === 'cow') {
    switch (normalized) {
      case 'healthy':
        colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        label = 'Healthy';
        break;
      case 'needs_attention':
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
        label = 'Needs Attention';
        break;
      case 'critical':
        colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
        label = 'Critical';
        break;
      default:
        label = status;
    }
  } else if (type === 'vaccination') {
    switch (normalized) {
      case 'completed':
        colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        label = 'Up to Date';
        break;
      case 'due_soon':
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
        label = 'Due Soon';
        break;
      case 'overdue':
        colorClasses = 'bg-rose-50 text-rose-800 border-rose-200';
        label = 'Overdue';
        break;
      default:
        label = status;
    }
  } else if (type === 'urgency') {
    switch (normalized) {
      case 'low':
        colorClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
        label = 'Low Urgency';
        break;
      case 'medium':
        colorClasses = 'bg-amber-50 text-amber-800 border-amber-200';
        label = 'Medium Urgency';
        break;
      case 'high':
        colorClasses = 'bg-orange-50 text-orange-800 border-orange-200';
        label = 'High Urgency';
        break;
      case 'emergency':
        colorClasses = 'bg-rose-100 text-rose-900 border-rose-300 font-bold animate-pulse';
        label = 'EMERGENCY';
        break;
      default:
        label = status;
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}>
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-75"></span>
      {label}
    </span>
  );
};

export default StatusBadge;
