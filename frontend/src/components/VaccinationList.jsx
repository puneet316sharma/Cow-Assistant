import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Syringe, Plus, Calendar, User, FileText } from 'lucide-react';
import { addVaccinationApi } from '../api/vaccinations.api';

const VaccinationList = ({ tagId, vaccinations = [], onVaccinationAdded }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    vaccineName: '',
    dateAdministered: new Date().toISOString().split('T')[0],
    nextDueDate: '',
    administeredBy: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vaccineName || !formData.dateAdministered || !formData.nextDueDate) {
      setError('Vaccine Name, Date Administered, and Next Due Date are required.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await addVaccinationApi(tagId, formData);
      setFormData({
        vaccineName: '',
        dateAdministered: new Date().toISOString().split('T')[0],
        nextDueDate: '',
        administeredBy: '',
        notes: ''
      });
      setShowAddForm(false);
      if (onVaccinationAdded) onVaccinationAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record vaccination.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Syringe className="w-5 h-5 text-emerald-600" />
            Vaccination History
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Track immunizations and automated due date notifications
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? 'Cancel' : 'Record Vaccination'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-4">
          <h4 className="font-semibold text-sm text-stone-800 border-b border-stone-200 pb-2">
            New Vaccination Entry
          </h4>

          {error && <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2 rounded">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Vaccine Name *</label>
              <input
                type="text"
                placeholder="e.g. Brucellosis, Blackleg, FMD"
                value={formData.vaccineName}
                onChange={(e) => setFormData({ ...formData, vaccineName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Administered By</label>
              <input
                type="text"
                placeholder="Dr. Smith / Vet Clinic"
                value={formData.administeredBy}
                onChange={(e) => setFormData({ ...formData, administeredBy: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Date Administered *</label>
              <input
                type="date"
                value={formData.dateAdministered}
                onChange={(e) => setFormData({ ...formData, dateAdministered: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">Next Booster / Due Date *</label>
              <input
                type="date"
                value={formData.nextDueDate}
                onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">Notes / Batch No.</label>
            <input
              type="text"
              placeholder="Batch #, dosage details or observations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 text-xs font-semibold rounded bg-emerald-700 text-white hover:bg-emerald-800 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      )}

      {vaccinations.length === 0 ? (
        <div className="text-center py-6 text-stone-500 text-sm bg-stone-50 rounded-lg border border-dashed border-stone-200">
          No vaccination records logged for Tag #{tagId} yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-100 text-stone-600 uppercase font-semibold text-2xs border-b border-stone-200">
              <tr>
                <th className="px-4 py-3">Vaccine Name</th>
                <th className="px-4 py-3">Administered</th>
                <th className="px-4 py-3">Next Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Administered By</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {vaccinations.map((vac) => (
                <tr key={vac._id || vac.id} className="hover:bg-stone-50 transition">
                  <td className="px-4 py-3 font-semibold text-stone-900">{vac.vaccineName}</td>
                  <td className="px-4 py-3 text-stone-600">
                    {new Date(vac.dateAdministered).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-stone-600">
                    {new Date(vac.nextDueDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={vac.status} type="vaccination" />
                  </td>
                  <td className="px-4 py-3 text-stone-600">{vac.administeredBy}</td>
                  <td className="px-4 py-3 text-stone-500 italic max-w-xs truncate">
                    {vac.notes || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VaccinationList;
