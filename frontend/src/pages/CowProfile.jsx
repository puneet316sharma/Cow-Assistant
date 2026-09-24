import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCowByTagIdApi } from '../api/cows.api';
import { analyzeSymptomsApi } from '../api/ai.api';
import { addHealthEventApi } from '../api/healthEvents.api';
import StatusBadge from '../components/StatusBadge';
import DisclaimerBanner from '../components/DisclaimerBanner';
import VaccinationList from '../components/VaccinationList';
import HealthEventTimeline from '../components/HealthEventTimeline';
import { Sparkles, Activity, Syringe, Calendar, ArrowLeft, Send, AlertTriangle, ShieldCheck, Plus } from 'lucide-react';

const CowProfile = () => {
  const { tagId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('ai_assistant'); // 'ai_assistant' | 'timeline' | 'vaccinations'

  // AI Form state
  const [symptomsText, setSymptomsText] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiError, setAiError] = useState('');
  const [latestAiResult, setLatestAiResult] = useState(null);

  // Health Event modal/form state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    type: 'checkup',
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchProfile();
  }, [tagId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await getCowByTagIdApi(tagId);
      setData(res);
      if (res.symptomReports && res.symptomReports.length > 0) {
        setLatestAiResult(res.symptomReports[0]);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to fetch profile for cow #${tagId}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAISymptomSubmit = async (e) => {
    e.preventDefault();
    if (!symptomsText.trim()) return;

    setAiAnalyzing(true);
    setAiError('');

    try {
      const report = await analyzeSymptomsApi(tagId, symptomsText);
      setLatestAiResult(report);
      setSymptomsText('');
      // Refresh profile data to include updated timeline events and cow status
      await fetchProfile();
    } catch (err) {
      setAiError(err.response?.data?.message || 'Failed to generate AI assessment.');
    } finally {
      setAiAnalyzing(false);
    }
  };

  const handleAddEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventForm.title) return;

    try {
      await addHealthEventApi(tagId, eventForm);
      setEventForm({ type: 'checkup', title: '', description: '' });
      setShowAddForm(false);
      await fetchProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to log health event');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-stone-500 text-sm">
        Loading digital health profile for Cow #{tagId}...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl mb-4">
          <AlertTriangle className="w-8 h-8 text-rose-600 mx-auto mb-2" />
          <h3 className="font-bold text-base">{error || 'Cow not found'}</h3>
        </div>
        <Link to="/" className="text-xs font-semibold text-emerald-800 hover:underline">
          &larr; Return to Dashboard
        </Link>
      </div>
    );
  }

  const { cow, vaccinations, healthEvents, symptomReports } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-stone-800"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Header Profile Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-stone-100 border border-stone-200 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
              🐄
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold text-stone-900 font-mono">
                  Tag #{cow.tagId}
                </h1>
                <StatusBadge status={cow.status} type="cow" />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 mt-2">
                <span><strong>Breed:</strong> {cow.breed}</span>
                <span>•</span>
                <span><strong>Sex:</strong> <span className="capitalize">{cow.sex}</span></span>
                <span>•</span>
                <span><strong>Age:</strong> {cow.age} yrs</span>
                <span>•</span>
                <span><strong>Weight:</strong> {cow.weight} kg</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-stone-200 flex gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('ai_assistant')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'ai_assistant'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          AI Assistant & Symptom Checker
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'timeline'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-600" />
          Health Event Timeline ({healthEvents.length})
        </button>

        <button
          onClick={() => setActiveTab('vaccinations')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
            activeTab === 'vaccinations'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Syringe className="w-4 h-4 text-emerald-600" />
          Vaccination Records ({vaccinations.length})
        </button>
      </div>

      {/* Tab 1: AI Assistant */}
      {activeTab === 'ai_assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Form Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-800">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900">Report Current Symptoms</h3>
                  <p className="text-2xs text-stone-500">
                    Describe observations in plain language for Gemini AI guidance.
                  </p>
                </div>
              </div>

              {aiError && (
                <div className="text-xs text-rose-600 font-medium bg-rose-50 p-2.5 rounded-lg">
                  {aiError}
                </div>
              )}

              <form onSubmit={handleAISymptomSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Observed Symptoms & Behavioral Changes *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={symptomsText}
                    onChange={(e) => setSymptomsText(e.target.value)}
                    placeholder="e.g. Cow is lethargic, refusing morning grain feed, has slight purulent nasal discharge, and elevated breathing rate."
                    className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none leading-relaxed"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={aiAnalyzing || !symptomsText.trim()}
                  className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg font-semibold text-xs text-white bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 transition shadow-xs cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {aiAnalyzing ? 'Analyzing with Gemini AI...' : 'Request AI Guidance'}
                </button>
              </form>
            </div>

            {/* Past AI Assessments List */}
            {symptomReports.length > 0 && (
              <div className="bg-stone-50 rounded-xl border border-stone-200 p-4 space-y-3">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Past Symptom Assessments ({symptomReports.length})
                </h4>
                <div className="space-y-2">
                  {symptomReports.map((sr) => (
                    <button
                      key={sr._id}
                      onClick={() => setLatestAiResult(sr)}
                      className={`w-full text-left p-3 rounded-lg border transition ${
                        latestAiResult?._id === sr._id
                          ? 'bg-white border-emerald-500 shadow-2xs'
                          : 'bg-white/60 border-stone-200 hover:bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-2xs font-bold text-stone-800">
                          {new Date(sr.createdAt).toLocaleDateString()}
                        </span>
                        <StatusBadge status={sr.aiResponse?.urgencyLevel} type="urgency" />
                      </div>
                      <p className="text-xs text-stone-600 truncate">{sr.symptomsText}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Response Display Column */}
          <div className="lg:col-span-7">
            {latestAiResult ? (
              <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
                <div className="flex justify-between items-start border-b border-stone-100 pb-4">
                  <div>
                    <span className="text-2xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Gemini AI Health Guidance
                    </span>
                    <h3 className="text-lg font-bold text-stone-900 mt-2">
                      Assessment Result
                    </h3>
                    <p className="text-2xs text-stone-400 mt-0.5">
                      Reported: {new Date(latestAiResult.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <StatusBadge status={latestAiResult.aiResponse?.urgencyLevel} type="urgency" />
                </div>

                {/* Always-rendered Veterinary Disclaimer */}
                <DisclaimerBanner customText={latestAiResult.aiResponse?.disclaimer} />

                {/* Reported Symptoms quote */}
                <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200">
                  <p className="text-2xs font-bold text-stone-500 uppercase">Reported Symptoms</p>
                  <p className="text-xs text-stone-800 italic mt-1 font-serif">
                    "{latestAiResult.symptomsText}"
                  </p>
                </div>

                {/* Structured Guidance Lists */}
                <div className="space-y-4">
                  {/* Possible Causes */}
                  <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      Possible Causes
                    </h4>
                    <ul className="space-y-1.5 pl-2">
                      {latestAiResult.aiResponse?.possibleCauses?.map((cause, i) => (
                        <li key={i} className="text-xs text-stone-800 flex items-start gap-2">
                          <span className="text-emerald-700 font-bold">•</span>
                          <span>{cause}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Warning Signs */}
                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                    <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                      Warning Signs To Monitor
                    </h4>
                    <ul className="space-y-1.5 pl-2">
                      {latestAiResult.aiResponse?.warningSigns?.map((sign, i) => (
                        <li key={i} className="text-xs text-stone-800 flex items-start gap-2">
                          <span className="text-amber-700 font-bold">•</span>
                          <span>{sign}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommended Next Steps */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <h4 className="font-bold text-xs text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-stone-700"></span>
                      Recommended Next Steps
                    </h4>
                    <ol className="space-y-1.5 pl-2 list-decimal list-inside text-xs text-stone-800">
                      {latestAiResult.aiResponse?.recommendedNextSteps?.map((step, i) => (
                        <li key={i} className="leading-relaxed">
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-stone-500 shadow-xs">
                <Sparkles className="w-10 h-10 text-emerald-600/40 mx-auto mb-3" />
                <h3 className="font-bold text-stone-800 text-base">No AI Guidance Requested Yet</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                  Describe any current symptoms, feed refusal, or physical changes in the box on the left to generate Gemini AI health insights.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Health Event Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-stone-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Health Event Timeline
              </h3>
              <p className="text-xs text-stone-500">
                Chronological record of checkups, illnesses, treatments, and symptom reports
              </p>
            </div>

            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {showAddEvent ? 'Cancel' : 'Add Health Event'}
            </button>
          </div>

          {showAddEvent && (
            <form onSubmit={handleAddEventSubmit} className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-3">
              <h4 className="font-semibold text-xs text-stone-800 uppercase">Log Health Event</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-medium text-stone-700 mb-1">Event Type</label>
                  <select
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-md bg-white"
                  >
                    <option value="checkup">Routine Checkup</option>
                    <option value="illness">Illness / Symptoms</option>
                    <option value="treatment">Treatment / Medication</option>
                    <option value="followup">Follow-up Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-2xs font-medium text-stone-700 mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Routine Hoof Trimming, Fever check"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-2xs font-medium text-stone-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Details, observations, or notes..."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-md"
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 text-white text-xs font-semibold rounded"
                >
                  Save Event
                </button>
              </div>
            </form>
          )}

          <HealthEventTimeline events={healthEvents} />
        </div>
      )}

      {/* Tab 3: Vaccination List */}
      {activeTab === 'vaccinations' && (
        <VaccinationList
          tagId={tagId}
          vaccinations={vaccinations}
          onVaccinationAdded={fetchProfile}
        />
      )}
    </div>
  );
};

export default CowProfile;
