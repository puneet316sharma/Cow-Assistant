import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDueVaccinationsApi } from '../api/vaccinations.api';
import StatusBadge from '../components/StatusBadge';
import { Syringe, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';

const VaccinationManager = () => {
  const [dueRecords, setDueRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDueVaccinations();
  }, []);

  const fetchDueVaccinations = async () => {
    setLoading(true);
    try {
      const records = await getDueVaccinationsApi();
      setDueRecords(records);
    } catch (err) {
      console.error('Failed to load due vaccinations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Syringe className="w-6 h-6 text-amber-600" />
            Vaccination Manager & Schedule
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Automated notifications for upcoming and overdue herd immunizations.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-12 rounded-xl text-center text-stone-500 text-xs border border-stone-200">
          Loading vaccination schedules...
        </div>
      ) : dueRecords.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center text-stone-600 border border-stone-200 shadow-xs space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-stone-900 text-base">All Immunizations Up To Date!</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            There are currently no overdue or due-soon vaccination boosters required across your herd.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 bg-amber-50 border-b border-amber-200 text-amber-900 flex items-center gap-2 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Found {dueRecords.length} vaccination record(s) requiring attention in the next 14 days</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-2xs border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3.5">Tag ID</th>
                  <th className="px-6 py-3.5">Vaccine Name</th>
                  <th className="px-6 py-3.5">Last Administered</th>
                  <th className="px-6 py-3.5">Next Due Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {dueRecords.map((record) => (
                  <tr key={record._id} className="hover:bg-stone-50 transition">
                    <td className="px-6 py-4 font-bold text-stone-900">
                      <Link
                        to={`/cows/${record.cowId?.tagId}`}
                        className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-mono border border-stone-300 hover:bg-emerald-100 hover:border-emerald-300 transition"
                      >
                        #{record.cowId?.tagId || 'N/A'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold text-stone-800">{record.vaccineName}</td>
                    <td className="px-6 py-4 text-stone-600">
                      {new Date(record.dateAdministered).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-stone-900 font-semibold">
                      {new Date(record.nextDueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={record.status} type="vaccination" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/cows/${record.cowId?.tagId}`}
                        className="text-xs font-semibold text-emerald-800 hover:underline"
                      >
                        View Cow Record &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationManager;
