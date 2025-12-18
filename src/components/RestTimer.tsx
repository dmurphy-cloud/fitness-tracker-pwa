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
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-brand text-white rounded-xl active:scale-95 transition-transform touch-manipulation shadow-lg shadow-brand-500/25"
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
          <span className="font-mono font-bold text-lg">
            {timeLeft > 0 ? formatTime(timeLeft) : formatTime(defaultSeconds)}
          </span>
        </button>
        {timeLeft > 0 && (
          <button
            onClick={reset}
            className="p-2.5 bg-dark-100 dark:bg-dark-800 rounded-xl active:scale-95 transition-transform touch-manipulation"
          >
            <RotateCcw size={18} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="section-header text-center mb-6">
        Rest Timer
      </h3>

      {/* Timer Display */}
      <div className="relative w-52 h-52 mx-auto mb-8">
        {/* Glow effect when running */}
        {isRunning && (
          <div className="absolute inset-0 rounded-full bg-brand-500/20 blur-xl timer-pulse" />
        )}

        {/* Background circle */}
        <svg className="w-full h-full -rotate-90 relative" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-dark-200 dark:text-dark-700"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
            className={`transition-all duration-300 ${isRunning ? '' : ''}`}
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono font-bold text-dark-900 dark:text-white">
            {timeLeft > 0 ? formatTime(timeLeft) : formatTime(defaultSeconds)}
          </span>
          {isRunning && (
            <span className="text-xs font-medium text-brand-500 uppercase tracking-wider mt-1">
              Resting
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button
          onClick={() => addTime(-15)}
          disabled={timeLeft <= 15}
          className="w-14 h-14 rounded-2xl bg-dark-100 dark:bg-dark-800 disabled:opacity-30 active:scale-95 transition-all touch-manipulation flex items-center justify-center"
        >
          <Minus size={24} className="text-dark-600 dark:text-dark-300" />
        </button>

        <button
          onClick={handleStartPause}
          className={`w-20 h-20 rounded-full text-white active:scale-95 transition-all touch-manipulation shadow-xl flex items-center justify-center
            ${isRunning
              ? 'bg-gradient-accent shadow-accent-500/30'
              : 'bg-gradient-brand shadow-brand-500/30'
            }
          `}
        >
          {isRunning ? <Pause size={36} /> : <Play size={36} className="ml-1" />}
        </button>

        <button
          onClick={() => addTime(15)}
          className="w-14 h-14 rounded-2xl bg-dark-100 dark:bg-dark-800 active:scale-95 transition-all touch-manipulation flex items-center justify-center"
        >
          <Plus size={24} className="text-dark-600 dark:text-dark-300" />
        </button>
      </div>

      {/* Quick presets */}
      <div className="flex justify-center gap-2 mb-4">
        {[60, 90, 120, 180].map((secs) => (
          <button
            key={secs}
            onClick={() => start(secs)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all touch-manipulation
              ${defaultSeconds === secs
                ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                : 'bg-dark-100 dark:bg-dark-800 text-dark-500 hover:bg-dark-200 dark:hover:bg-dark-700'
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
          className="flex items-center justify-center gap-2 mx-auto py-2 px-4 text-dark-400 hover:text-dark-600 dark:hover:text-dark-300 active:scale-95 transition-all touch-manipulation"
        >
          <RotateCcw size={16} />
          <span className="text-sm font-medium">Reset Timer</span>
        </button>
      )}
    </div>
  );
}
