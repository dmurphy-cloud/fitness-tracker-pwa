import { ChevronRight, CheckCircle2, Clock, Dumbbell } from 'lucide-react';
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
      className={`card w-full p-4 text-left active:scale-[0.98] transition-transform touch-manipulation
        ${isActive ? 'ring-2 ring-primary-500' : ''}
        ${completedToday ? 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800' : ''}
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase">
              Day {day.dayNumber}
            </span>
            {completedToday && (
              <span className="flex items-center gap-1 text-xs text-success-600 dark:text-success-400">
                <CheckCircle2 size={14} />
                Done today
              </span>
            )}
          </div>

          <h3 className="text-lg font-bold mb-1">{day.name}</h3>

          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Dumbbell size={14} />
              {day.exercises.length} exercises
            </span>
            {lastLog && !completedToday && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                Last: {format(parseISO(lastLog.date), 'MMM d')}
              </span>
            )}
          </div>
        </div>

        <ChevronRight size={24} className="text-slate-400" />
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
      className={`flex flex-col items-center p-3 rounded-xl min-w-[80px] transition-all touch-manipulation
        ${completed
          ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
        }
        active:scale-95
      `}
    >
      <span className="text-xs font-medium opacity-70">Day {day.dayNumber}</span>
      <span className="text-sm font-bold truncate max-w-full">
        {day.name.split(' ')[0]}
      </span>
      {completed && <CheckCircle2 size={16} className="mt-1" />}
    </button>
  );
}
