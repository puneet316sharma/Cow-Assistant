import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createCowApi } from '../api/cows.api';
import { PlusCircle, ArrowLeft } from 'lucide-react';

const RegisterCow = () => {
  const [formData, setFormData] = useState({
    tagId: '',
    breed: '',
    age: '',
    sex: 'female',
    weight: '',
    photoUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.tagId || !formData.breed || !formData.age || !formData.weight) {
      setError('Tag ID, Breed, Age, and Weight are required.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const cow = await createCowApi({
        ...formData,
        age: Number(formData.age),
        weight: Number(formData.weight)
      });
      navigate(`/cows/${cow.tagId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register cow.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">
              🐄
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Register New Cow</h2>
              <p className="text-xs text-stone-500">
                Enter unique Tag ID and physical characteristics to initialize digital record.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Tag ID (Unique Ear Tag / RFID) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. COW-101, AG-99"
              value={formData.tagId}
              onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 focus:outline-none uppercase"
            />
            <p className="text-2xs text-stone-400 mt-1">
              Unique identifier used for searching health history & AI lookups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Breed *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Holstein, Angus, Jersey, Hereford"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Sex *
              </label>
              <select
                value={formData.sex}
                onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                <option value="female">Female (Cow/Heifer)</option>
                <option value="male">Male (Bull/Steer)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Age (years) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                placeholder="e.g. 3.5"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="1"
                min="0"
                required
                placeholder="e.g. 550"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link
              to="/"
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-800"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-800 text-white hover:bg-emerald-900 disabled:opacity-50 transition shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              {loading ? 'Registering...' : 'Register Cow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterCow;
