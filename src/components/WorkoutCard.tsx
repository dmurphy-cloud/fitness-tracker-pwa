import { ChevronRight, CheckCircle2, Clock, Dumbbell, Sparkles } from 'lucide-react';
import type { WorkoutDay, WorkoutLog } from '../types';
import { format, isToday, parseISO } from 'date-fns';

interface WorkoutCardProps {
  day: WorkoutDay;
  lastLog?: WorkoutLog;
  isActive?: boolean;
  onClick: () => void;
}

export function WorkoutCard({ day, lastLog, isActive, onClick }: WorkoutCardProps) {
  const completedToday = lastLog && isToday(parseISO(lastLog.date));

  return (
    <button
      onClick={onClick}
      className={`card-interactive w-full p-5 text-left
        ${isActive && !completedToday ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-dark-950' : ''}
        ${completedToday ? 'bg-gradient-to-br from-success-50 to-success-100/50 dark:from-success-900/20 dark:to-success-900/10 border-success-200 dark:border-success-800/50' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-brand">
              Day {day.dayNumber}
            </span>
            {completedToday && (
              <span className="badge badge-success flex items-center gap-1">
                <CheckCircle2 size={12} />
                Complete
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-dark-900 dark:text-white mb-2">{day.name}</h3>

          <div className="flex items-center gap-4 text-sm text-dark-500">
            <span className="flex items-center gap-1.5">
              <Dumbbell size={14} className="text-brand-500" />
              {day.exercises.length} exercises
            </span>
            {lastLog && !completedToday && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-dark-400" />
                Last: {format(parseISO(lastLog.date), 'MMM d')}
              </span>
            )}
          </div>
        </div>

        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
          ${completedToday
            ? 'bg-success-500 text-white'
            : isActive
              ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-500'
              : 'bg-dark-100 dark:bg-dark-800 text-dark-400'
          }
        `}>
          {completedToday ? (
            <CheckCircle2 size={24} />
          ) : (
            <ChevronRight size={24} />
          )}
        </div>
      </div>
    </button>
  );
}

interface MiniWorkoutCardProps {
  day: WorkoutDay;
  onClick: () => void;
  completed?: boolean;
}

export function MiniWorkoutCard({ day, onClick, completed }: MiniWorkoutCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-2xl min-w-[90px] transition-all touch-manipulation
        ${completed
          ? 'bg-gradient-success text-white shadow-lg shadow-success-500/30'
          : 'bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
        }
        active:scale-95
      `}
    >
      <span className={`text-2xs font-bold uppercase tracking-wider mb-1 ${completed ? 'text-success-100' : 'text-dark-400'}`}>
        Day {day.dayNumber}
      </span>
      <span className="text-sm font-bold truncate max-w-full">
        {day.name.split(' ')[0]}
      </span>
      {completed && (
        <Sparkles size={14} className="mt-1.5 text-success-200" />
      )}
    </button>
  );
}
