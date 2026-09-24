import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboardSummaryApi } from '../api/dashboard.api';
import { getCowsApi } from '../api/cows.api';
import StatusBadge from '../components/StatusBadge';
import { ShieldAlert, Syringe, HeartPulse, CheckCircle2, Search, Filter, Plus, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const [summary, setSummary] = useState({
    totalCows: 0,
    vaccinationsDue: 0,
    healthFollowUps: 0,
    healthy: 0
  });
  const [cows, setCows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumData, cowList] = await Promise.all([
        getDashboardSummaryApi(),
        getCowsApi({ status: statusFilter || undefined })
      ]);
      setSummary(sumData);
      setCows(cowList);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCows = cows.filter(c =>
    c.tagId.toLowerCase().includes(search.toLowerCase()) ||
    c.breed.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-emerald-900 text-white p-6 rounded-2xl shadow-sm border border-emerald-950">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Farm Overview & Herd Health</h1>
          <p className="text-xs text-emerald-200 mt-1">
            Monitor digital health records, vaccination schedules, and AI symptom assessments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/register-cow"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Register Cow
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Cows */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Cows</p>
              <h3 className="text-3xl font-extrabold text-stone-900 mt-1">{summary.totalCows}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800">
              <span className="text-xl">🐄</span>
            </div>
          </div>
          <p className="text-2xs text-stone-400 mt-3">Registered on farm registry</p>
        </div>

        {/* Card 2: Vaccinations Due */}
        <Link to="/vaccinations" className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition block">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Vaccinations Due</p>
              <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{summary.vaccinationsDue}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
              <Syringe className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xs text-amber-600 font-medium mt-3 flex items-center gap-1">
            View due/overdue schedule &rarr;
          </p>
        </Link>

        {/* Card 3: Health Follow-ups */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Health Follow-ups</p>
              <h3 className="text-3xl font-extrabold text-rose-600 mt-1">{summary.healthFollowUps}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xs text-stone-400 mt-3">Open symptom reports</p>
        </div>

        {/* Card 4: Healthy */}
        <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-2xs hover:shadow-xs transition">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Healthy Herd</p>
              <h3 className="text-3xl font-extrabold text-emerald-700 mt-1">{summary.healthy}</h3>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xs text-stone-400 mt-3">No immediate concerns</p>
        </div>
      </div>

      {/* Herd Management & Search List Section */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Cow Registry</h2>
            <p className="text-xs text-stone-500">
              Look up cows by Tag ID to view full health records and request AI guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search Tag ID or breed..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs border border-stone-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="">All Statuses</option>
                <option value="healthy">Healthy</option>
                <option value="needs_attention">Needs Attention</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="p-12 text-center text-stone-500 text-xs">
            Loading cow records...
          </div>
        ) : filteredCows.length === 0 ? (
          <div className="p-12 text-center text-stone-500 text-xs space-y-3">
            <p className="font-semibold text-stone-700">No cows found matching query.</p>
            <Link
              to="/register-cow"
              className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-semibold"
            >
              <Plus className="w-4 h-4" />
              Register a new cow
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold text-2xs border-b border-stone-200">
                <tr>
                  <th className="px-6 py-3.5">Tag ID</th>
                  <th className="px-6 py-3.5">Breed</th>
                  <th className="px-6 py-3.5">Sex</th>
                  <th className="px-6 py-3.5">Age</th>
                  <th className="px-6 py-3.5">Weight</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredCows.map((cow) => (
                  <tr
                    key={cow._id}
                    onClick={() => navigate(`/cows/${cow.tagId}`)}
                    className="hover:bg-emerald-50/50 cursor-pointer transition"
                  >
                    <td className="px-6 py-4 font-bold text-stone-900 flex items-center gap-2">
                      <span className="text-base">🐄</span>
                      <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-mono border border-stone-300">
                        {cow.tagId}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-stone-700">{cow.breed}</td>
                    <td className="px-6 py-4 capitalize text-stone-600">{cow.sex}</td>
                    <td className="px-6 py-4 text-stone-600">{cow.age} yrs</td>
                    <td className="px-6 py-4 text-stone-600">{cow.weight} kg</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={cow.status} type="cow" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 hover:text-emerald-900">
                        Profile <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
