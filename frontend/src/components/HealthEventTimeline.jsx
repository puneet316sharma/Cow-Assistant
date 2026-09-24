import React from 'react';
import { Activity, Syringe, AlertTriangle, Stethoscope, CheckCircle2, FileText } from 'lucide-react';

const getEventIcon = (type) => {
  switch (type) {
    case 'vaccination':
      return <Syringe className="w-4 h-4 text-emerald-600" />;
    case 'illness':
      return <AlertTriangle className="w-4 h-4 text-rose-600" />;
    case 'symptom_report':
      return <Activity className="w-4 h-4 text-amber-600" />;
    case 'checkup':
      return <Stethoscope className="w-4 h-4 text-sky-600" />;
    case 'treatment':
      return <CheckCircle2 className="w-4 h-4 text-purple-600" />;
    default:
      return <FileText className="w-4 h-4 text-stone-600" />;
  }
};

const HealthEventTimeline = ({ events = [] }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500 bg-stone-50 rounded-lg border border-dashed border-stone-200">
        <Activity className="w-8 h-8 mx-auto text-stone-400 mb-2 opacity-50" />
        <p>No health events recorded yet for this cow.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 border-l-2 border-stone-200 space-y-6 my-4">
      {events.map((event) => (
        <div key={event._id || event.id} className="relative group">
          {/* Node Icon */}
          <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center shadow-xs">
            {getEventIcon(event.type)}
          </div>

          {/* Event Content Card */}
          <div className="bg-white rounded-lg border border-stone-200 p-4 shadow-2xs hover:shadow-xs transition">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-stone-900 text-sm">{event.title}</h4>
              <span className="text-xs text-stone-400">
                {new Date(event.date || event.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed mb-2 whitespace-pre-line">
              {event.description}
            </p>

            <div className="flex items-center justify-between text-2xs text-stone-400 pt-2 border-t border-stone-100">
              <span className="capitalize px-2 py-0.5 rounded bg-stone-100 font-medium text-stone-600">
                {event.type.replace('_', ' ')}
              </span>
              <span>Recorded by: {event.recordedBy || 'System'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthEventTimeline;
