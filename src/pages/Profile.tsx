import { useState } from 'react';
import { User, Moon, Sun, Target, Timer, Info, Trash2, Download } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe-top">
      {/* Header */}
      <header className="px-4 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 safe-area-top">
        <h1 className="text-2xl font-bold">Profile & Settings</h1>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Profile section */}
        <section className="card overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <button
                  onClick={() => startEdit('name', profile.name)}
                  className="text-xl font-bold hover:underline"
                >
                  {profile.name}
                </button>
                <p className="text-primary-200 text-sm">
                  Started {format(parseISO(profile.startDate), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {/* Current Weight */}
            <button
              onClick={() => startEdit('currentWeight', profile.currentWeight)}
              className="w-full p-4 flex items-center justify-between text-left touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Target size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium">Current Weight</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your current body weight</p>
                </div>
              </div>
              <span className="font-bold">{profile.currentWeight} kg</span>
            </button>

            {/* Goal Weight */}
            <button
              onClick={() => startEdit('goalWeight', profile.goalWeight)}
              className="w-full p-4 flex items-center justify-between text-left touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                  <Target size={20} className="text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <p className="font-medium">Goal Weight</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Your target weight</p>
                </div>
              </div>
              <span className="font-bold">{profile.goalWeight} kg</span>
            </button>

            {/* Rest Timer Default */}
            <button
              onClick={() => startEdit('restTimerDefault', profile.restTimerDefault)}
              className="w-full p-4 flex items-center justify-between text-left touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Timer size={20} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-medium">Default Rest Time</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Between sets</p>
                </div>
              </div>
              <span className="font-bold">{profile.restTimerDefault}s</span>
            </button>
          </div>
        </section>

        {/* Appearance */}
        <section className="card overflow-hidden">
          <h2 className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
            Appearance
          </h2>

          <button
            onClick={toggleDarkMode}
            className="w-full p-4 flex items-center justify-between text-left touch-manipulation"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {darkMode ? 'Currently enabled' : 'Currently disabled'}
                </p>
              </div>
            </div>
            <div
              className={`w-12 h-7 rounded-full transition-colors ${
                darkMode ? 'bg-primary-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white mt-1 transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </div>
          </button>
        </section>

        {/* Data Management */}
        <section className="card overflow-hidden">
          <h2 className="p-4 text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50">
            Data
          </h2>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            <button
              onClick={handleExportData}
              className="w-full p-4 flex items-center gap-3 text-left touch-manipulation"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Download size={20} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Download your workout history
                </p>
              </div>
            </button>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full p-4 flex items-center gap-3 text-left touch-manipulation text-red-600"
            >
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
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
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-4">
            Your Stats
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {workoutLogs.filter(l => l.completed).length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Workouts</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {weightEntries.length}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Weight Logs</p>
            </div>
          </div>
        </section>

        {/* App info */}
        <section className="card p-4">
          <div className="flex items-center gap-3 mb-4">
            <Info size={20} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">
              About
            </span>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">FitTrack</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Version 1.0.0</p>
            <p className="text-xs text-slate-400 mt-2">
              Personal workout tracker for progressive overload training
            </p>
          </div>
        </section>

        {/* Install instructions */}
        <section className="card p-4">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">
            Install on iPhone
          </h2>
          <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li className="flex gap-2">
              <span className="font-bold text-primary-600">1.</span>
              Tap the Share button in Safari
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary-600">2.</span>
              Scroll down and tap "Add to Home Screen"
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-primary-600">3.</span>
              Tap "Add" in the top right corner
            </li>
          </ol>
        </section>
      </main>

      {/* Edit Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 m-4 max-w-sm w-full slide-up">
            <h3 className="text-xl font-bold mb-4 capitalize">
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
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 btn btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirm Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 m-4 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-2 text-red-600">Reset All Data?</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              This will permanently delete all your workouts, weight logs, and progress. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 btn bg-red-500 text-white hover:bg-red-600"
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
