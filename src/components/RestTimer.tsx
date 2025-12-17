import { useRestTimer, formatTime } from '../hooks/useRestTimer';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';

interface RestTimerProps {
  defaultSeconds?: number;
  onComplete?: () => void;
  compact?: boolean;
}

export function RestTimer({ defaultSeconds = 120, onComplete, compact = false }: RestTimerProps) {
  const { timeLeft, isRunning, progress, start, pause, resume, reset, addTime } = useRestTimer(onComplete);

  const handleStartPause = () => {
    if (isRunning) {
      pause();
    } else if (timeLeft > 0) {
      resume();
    } else {
      start(defaultSeconds);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleStartPause}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl active:scale-95 transition-transform touch-manipulation"
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          <span className="font-mono font-bold text-lg">
            {timeLeft > 0 ? formatTime(timeLeft) : formatTime(defaultSeconds)}
          </span>
        </button>
        {timeLeft > 0 && (
          <button
            onClick={reset}
            className="p-2 bg-slate-200 dark:bg-slate-700 rounded-xl active:scale-95 transition-transform touch-manipulation"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wide">
        Rest Timer
      </h3>

      {/* Timer Display */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
            className={`text-primary-500 transition-all duration-1000 ${isRunning ? 'timer-pulse' : ''}`}
          />
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-mono font-bold">
            {timeLeft > 0 ? formatTime(timeLeft) : formatTime(defaultSeconds)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => addTime(-15)}
          disabled={timeLeft <= 15}
          className="p-3 rounded-xl bg-slate-200 dark:bg-slate-700 disabled:opacity-50 active:scale-95 transition-transform touch-manipulation"
        >
          <Minus size={24} />
        </button>

        <button
          onClick={handleStartPause}
          className="p-5 rounded-full bg-primary-600 text-white active:scale-95 transition-transform touch-manipulation shadow-lg"
        >
          {isRunning ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
        </button>

        <button
          onClick={() => addTime(15)}
          className="p-3 rounded-xl bg-slate-200 dark:bg-slate-700 active:scale-95 transition-transform touch-manipulation"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Quick presets */}
      <div className="flex justify-center gap-2 mt-4">
        {[60, 90, 120, 180].map((secs) => (
          <button
            key={secs}
            onClick={() => start(secs)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors touch-manipulation
              ${defaultSeconds === secs
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
          >
            {formatTime(secs)}
          </button>
        ))}
      </div>

      {/* Reset */}
      {timeLeft > 0 && (
        <button
          onClick={reset}
          className="flex items-center justify-center gap-2 w-full mt-4 py-2 text-slate-500 dark:text-slate-400 active:scale-95 transition-transform touch-manipulation"
        >
          <RotateCcw size={16} />
          <span className="text-sm">Reset</span>
        </button>
      )}
    </div>
  );
}
