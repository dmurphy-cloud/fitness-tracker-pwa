import { useState } from 'react';
import { User, Moon, Sun, Target, Timer, Info, Trash2, Download, Dumbbell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format, parseISO } from 'date-fns';

export function Profile() {
  const {
    profile,
    updateProfile,
    darkMode,
    toggleDarkMode,
    workoutLogs,
    weightEntries,
  } = useApp();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const startEdit = (field: string, value: string | number) => {
    setEditingField(field);
    setEditValue(value.toString());
  };

  const saveEdit = async () => {
    if (!profile || !editingField) return;

    const updates: Record<string, any> = {};

    switch (editingField) {
      case 'name':
        updates.name = editValue;
        break;
      case 'currentWeight':
        updates.currentWeight = parseFloat(editValue) || profile.currentWeight;
        break;
      case 'goalWeight':
        updates.goalWeight = parseFloat(editValue) || profile.goalWeight;
        break;
      case 'restTimerDefault':
        updates.restTimerDefault = parseInt(editValue) || profile.restTimerDefault;
        break;
    }

    await updateProfile(updates);
    setEditingField(null);
    setEditValue('');
  };

  const handleExportData = () => {
    const data = {
      profile,
      workoutLogs,
      weightEntries,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fittrack-backup-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = async () => {
    // Clear IndexedDB
    const databases = ['fittrack-db'];
    for (const db of databases) {
      await new Promise<void>((resolve) => {
        const req = indexedDB.deleteDatabase(db);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
      });
    }
    // Reload page
    window.location.reload();
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <p className="text-dark-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe-top bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="px-4 py-4 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-700/50 safe-area-top">
        <h1 className="text-2xl font-bold text-dark-900 dark:text-white">Profile & Settings</h1>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Profile section */}
        <section className="card overflow-hidden">
          <div className="p-6 bg-gradient-brand text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-mesh-dark opacity-30" />
            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <User size={32} />
              </div>
              <div>
                <button
                  onClick={() => startEdit('name', profile.name)}
                  className="text-xl font-bold hover:underline"
                >
                  {profile.name}
                </button>
                <p className="text-brand-100 text-sm">
                  Started {format(parseISO(profile.startDate), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-dark-200 dark:divide-dark-700">
            {/* Current Weight */}
            <button
              onClick={() => startEdit('currentWeight', profile.currentWeight)}
              className="w-full p-4 flex items-center justify-between text-left touch-manipulation hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                  <Target size={20} className="text-brand-600 dark:text-brand-400" />
                </div>
                <div>
                  <p className="font-medium text-dark-900 dark:text-white">Current Weight</p>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Your current body weight</p>
                </div>
              </div>
              <span className="font-bold text-dark-900 dark:text-white">{profile.currentWeight} kg</span>
            </button>

            {/* Goal Weight */}
            <button
              onClick={() => startEdit('goalWeight', profile.goalWeight)}
              className="w-full p-4 flex items-center justify-between text-left touch-manipulation hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                  <Target size={20} className="text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <p className="font-medium text-dark-900 dark:text-white">Goal Weight</p>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Your target weight</p>
                </div>
              </div>
              <span className="font-bold text-dark-900 dark:text-white">{profile.goalWeight} kg</span>
            </button>

            {/* Rest Timer Default */}
            <button
              onClick={() => startEdit('restTimerDefault', profile.restTimerDefault)}
              className="w-full p-4 flex items-center justify-between text-left touch-manipulation hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Timer size={20} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-dark-900 dark:text-white">Default Rest Time</p>
                  <p className="text-sm text-dark-500 dark:text-dark-400">Between sets</p>
                </div>
              </div>
              <span className="font-bold text-dark-900 dark:text-white">{profile.restTimerDefault}s</span>
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section className="card overflow-hidden">
          <h2 className="p-4 text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase bg-dark-50 dark:bg-dark-800/50">
            Appearance
          </h2>

          <button
            onClick={toggleDarkMode}
            className="w-full p-4 flex items-center justify-between text-left touch-manipulation hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dark-100 dark:bg-dark-700 flex items-center justify-center">
                {darkMode ? <Moon size={20} className="text-brand-400" /> : <Sun size={20} className="text-amber-500" />}
              </div>
              <div>
                <p className="font-medium text-dark-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-dark-500 dark:text-dark-400">
                  {darkMode ? 'Currently enabled' : 'Currently disabled'}
                </p>
              </div>
            </div>
            <div
              className={`w-14 h-8 rounded-full transition-all duration-300 ${
                darkMode ? 'bg-gradient-brand shadow-lg shadow-brand-500/25' : 'bg-dark-300'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full bg-white mt-1 transition-transform shadow-md ${
                  darkMode ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </div>
          </button>
        </section>

        {/* Data Management */}
        <section className="card overflow-hidden">
          <h2 className="p-4 text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase bg-dark-50 dark:bg-dark-800/50">
            Data
          </h2>

          <div className="divide-y divide-dark-200 dark:divide-dark-700">
            <button
              onClick={handleExportData}
              className="w-full p-4 flex items-center gap-3 text-left touch-manipulation hover:bg-dark-50 dark:hover:bg-dark-800/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Download size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-dark-900 dark:text-white">Export Data</p>
                <p className="text-sm text-dark-500 dark:text-dark-400">
                  Download your workout history
                </p>
              </div>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full p-4 flex items-center gap-3 text-left touch-manipulation hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-red-600"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 size={20} />
              </div>
              <div>
                <p className="font-medium">Reset All Data</p>
                <p className="text-sm text-red-400">
                  Delete all workouts and progress
                </p>
              </div>
            </button>
          </div>
        </section>

        {/* Stats summary */}
        <section className="card p-4">
          <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase mb-4">
            Your Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-2xl bg-brand-50 dark:bg-brand-900/20">
              <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                {workoutLogs.filter(l => l.completed).length}
              </p>
              <p className="text-sm text-dark-500 dark:text-dark-400">Total Workouts</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-accent-50 dark:bg-accent-900/20">
              <p className="text-3xl font-bold text-accent-600 dark:text-accent-400">
                {weightEntries.length}
              </p>
              <p className="text-sm text-dark-500 dark:text-dark-400">Weight Logs</p>
            </div>
          </div>
        </section>

        {/* App info */}
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Info size={20} className="text-dark-400" />
            <span className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase">
              About
            </span>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-brand mx-auto mb-3 flex items-center justify-center shadow-lg shadow-brand-500/25">
              <Dumbbell size={32} className="text-white" />
            </div>
            <p className="text-2xl font-bold text-dark-900 dark:text-white">FitTrack Pro</p>
            <p className="text-sm text-dark-500 dark:text-dark-400">Version 1.0.0</p>
            <p className="text-xs text-dark-400 mt-2">
              Personal workout tracker for progressive overload training
            </p>
          </div>
        </section>

        {/* Install instructions */}
        <section className="card p-4">
          <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase mb-3">
            Install on iPhone
          </h2>
          <ol className="text-sm text-dark-600 dark:text-dark-400 space-y-2">
            <li className="flex gap-2">
              <span className="font-bold text-brand-600 dark:text-brand-400">1.</span>
              Tap the Share button in Safari
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-brand-600 dark:text-brand-400">2.</span>
              Scroll down and tap "Add to Home Screen"
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-brand-600 dark:text-brand-400">3.</span>
              Tap "Add" in the top right corner
            </li>
          </ol>
        </section>
      </main>

      {/* Edit Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 m-4 max-w-sm w-full slide-up shadow-2xl border border-dark-200 dark:border-dark-700">
            <h3 className="text-xl font-bold mb-4 capitalize text-dark-900 dark:text-white">
              Edit {editingField.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </h3>

            <input
              type={editingField.includes('Weight') || editingField.includes('Timer') ? 'number' : 'text'}
              inputMode={editingField.includes('Weight') ? 'decimal' : editingField.includes('Timer') ? 'numeric' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="input text-xl font-bold text-center"
              autoFocus
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingField(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 btn-brand"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 m-4 max-w-sm w-full shadow-2xl border border-dark-200 dark:border-dark-700">
            <h3 className="text-xl font-bold mb-2 text-red-600">Reset All Data?</h3>
            <p className="text-dark-500 dark:text-dark-400 mb-6">
              This will permanently delete all your workouts, weight logs, and progress. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
