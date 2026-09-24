import React from 'react';
import { ShieldAlert } from 'lucide-react';

const DisclaimerBanner = ({ customText }) => {
  return (
    <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 text-amber-900 shadow-xs mb-6">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-amber-900 mb-1">
            Important Veterinary Disclaimer
          </p>
          <p className="text-amber-800 leading-relaxed">
            {customText || "This is general AI guidance based on symptoms provided, not a veterinary diagnosis or prescription. Always consult a licensed veterinarian for medical decisions and treatment schedules."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
