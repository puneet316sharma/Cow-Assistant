import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check form details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl">🌾</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            Create Account
          </h2>
          <p className="mt-1 text-xs text-stone-500">
            Join Cow Assistant Health Platform
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 text-center font-medium">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Farmer"
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@farm.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Account Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
              >
                <option value="farmer">Farmer / Livestock Owner</option>
                <option value="vet">Veterinarian</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-xs text-sm font-semibold text-white bg-emerald-800 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700 disabled:opacity-50 transition cursor-pointer mt-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-stone-100">
          <p className="text-xs text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-800 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
