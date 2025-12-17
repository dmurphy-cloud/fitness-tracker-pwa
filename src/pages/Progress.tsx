import { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { format, parseISO, subDays, subMonths, isAfter } from 'date-fns';
import { Scale, Calendar, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type TimeRange = '1w' | '1m' | '3m' | '6m' | 'all';

export function Progress() {
  const { profile, weightEntries, addWeightEntry, removeWeightEntry, workoutLogs } = useApp();
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState(profile?.currentWeight?.toString() || '');
  const [weightNotes, setWeightNotes] = useState('');

  // Filter weight entries by time range
  const filteredEntries = useMemo(() => {
    const now = new Date();
    let cutoffDate: Date;

    switch (timeRange) {
      case '1w':
        cutoffDate = subDays(now, 7);
        break;
      case '1m':
        cutoffDate = subMonths(now, 1);
        break;
      case '3m':
        cutoffDate = subMonths(now, 3);
        break;
      case '6m':
        cutoffDate = subMonths(now, 6);
        break;
      default:
        cutoffDate = new Date(0);
    }

    return weightEntries.filter(entry =>
      isAfter(parseISO(entry.date), cutoffDate)
    );
  }, [weightEntries, timeRange]);

  // Chart data
  const chartData = useMemo(() => {
    const sortedEntries = [...filteredEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      labels: sortedEntries.map(e => format(parseISO(e.date), 'MMM d')),
      datasets: [
        {
          label: 'Weight (kg)',
          data: sortedEntries.map(e => e.weight),
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        // Goal line
        {
          label: 'Goal',
          data: sortedEntries.map(() => profile?.goalWeight || 80),
          borderColor: 'rgba(16, 185, 129, 0.5)',
          borderDash: [5, 5],
          pointRadius: 0,
          fill: false,
        },
      ],
    };
  }, [filteredEntries, profile?.goalWeight]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          maxTicksLimit: 6,
        },
      },
      y: {
        min: Math.min(...filteredEntries.map(e => e.weight), profile?.goalWeight || 80) - 2,
        max: Math.max(...filteredEntries.map(e => e.weight), profile?.currentWeight || 94) + 2,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
      },
    },
  };

  // Stats calculations
  const stats = useMemo(() => {
    if (filteredEntries.length === 0) return null;

    const sorted = [...filteredEntries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const change = last.weight - first.weight;
    const lowest = Math.min(...sorted.map(e => e.weight));
    const highest = Math.max(...sorted.map(e => e.weight));
    const avgWeight = sorted.reduce((sum, e) => sum + e.weight, 0) / sorted.length;

    return {
      change,
      lowest,
      highest,
      avgWeight,
      current: last.weight,
      startWeight: first.weight,
    };
  }, [filteredEntries]);

  // Workout stats
  const workoutStats = useMemo(() => {
    const completed = workoutLogs.filter(l => l.completed);
    const totalWorkouts = completed.length;
    const totalDuration = completed.reduce((sum, l) => sum + (l.duration || 0), 0);
    const avgDuration = totalWorkouts > 0 ? Math.floor(totalDuration / totalWorkouts / 60) : 0;

    return { totalWorkouts, avgDuration };
  }, [workoutLogs]);

  const handleAddWeight = async () => {
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) return;

    await addWeightEntry(weight, weightNotes || undefined);
    setNewWeight(weight.toString());
    setWeightNotes('');
    setShowAddWeight(false);
  };

  return (
    <div className="min-h-screen pb-24 pt-safe-top">
      {/* Header */}
      <header className="px-4 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 safe-area-top">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Progress</h1>
          <button
            onClick={() => setShowAddWeight(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl active:scale-95 transition-transform touch-manipulation"
          >
            <Plus size={18} />
            <span className="font-medium">Log Weight</span>
          </button>
        </div>

        {/* Time range selector */}
        <div className="flex gap-2">
          {(['1w', '1m', '3m', '6m', 'all'] as TimeRange[]).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors touch-manipulation
                ${timeRange === range
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }
              `}
            >
              {range === 'all' ? 'All' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4 space-y-6">
        {/* Weight Chart */}
        <section className="card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Scale size={20} className="text-primary-600 dark:text-primary-400" />
            <h2 className="font-bold">Weight Trend</h2>
          </div>

          {filteredEntries.length > 0 ? (
            <div className="h-64">
              <Line data={chartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500 dark:text-slate-400">
              <div className="text-center">
                <Scale size={48} className="mx-auto mb-2 opacity-50" />
                <p>No weight entries yet</p>
                <button
                  onClick={() => setShowAddWeight(true)}
                  className="mt-2 text-primary-600 dark:text-primary-400 font-medium"
                >
                  Add your first entry
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Current</p>
              <p className="text-2xl font-bold">{stats.current.toFixed(1)} kg</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Change</p>
              <p className={`text-2xl font-bold ${stats.change < 0 ? 'text-success-500' : stats.change > 0 ? 'text-red-500' : ''}`}>
                {stats.change > 0 ? '+' : ''}{stats.change.toFixed(1)} kg
              </p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Lowest</p>
              <p className="text-2xl font-bold">{stats.lowest.toFixed(1)} kg</p>
            </div>
            <div className="card p-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">To Goal</p>
              <p className="text-2xl font-bold">
                {Math.max(0, stats.current - (profile?.goalWeight || 80)).toFixed(1)} kg
              </p>
            </div>
          </div>
        )}

        {/* Workout stats */}
        <section className="card p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={20} className="text-primary-600 dark:text-primary-400" />
            <h2 className="font-bold">Workout Stats</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Workouts</p>
              <p className="text-3xl font-bold">{workoutStats.totalWorkouts}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg Duration</p>
              <p className="text-3xl font-bold">{workoutStats.avgDuration} min</p>
            </div>
          </div>
        </section>

        {/* Recent weight entries */}
        {weightEntries.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Recent Entries
            </h2>
            <div className="space-y-2">
              {[...weightEntries]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map(entry => (
                  <div key={entry.id} className="card p-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold">{entry.weight} kg</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {format(parseISO(entry.date), 'MMM d, yyyy')}
                        {entry.notes && ` • ${entry.notes}`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeWeightEntry(entry.id)}
                      className="p-2 text-red-500 touch-manipulation"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
            </div>
          </section>
        )}
      </main>

      {/* Add Weight Modal */}
      {showAddWeight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 m-4 max-w-sm w-full slide-up">
            <h3 className="text-xl font-bold mb-4">Log Weight</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  className="input text-2xl font-bold text-center"
                  placeholder="0.0"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2 block">
                  Notes (optional)
                </label>
                <input
                  type="text"
                  value={weightNotes}
                  onChange={(e) => setWeightNotes(e.target.value)}
                  className="input"
                  placeholder="e.g., Morning weigh-in"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddWeight(false)}
                className="flex-1 btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddWeight}
                className="flex-1 btn btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
