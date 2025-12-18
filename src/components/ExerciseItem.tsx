import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Check, Minus, Plus, Zap } from 'lucide-react';
import type { WorkoutExercise, ExerciseLog, SetLog } from '../types';
import { getExercise } from '../data/exercises';

interface ExerciseItemProps {
  workoutExercise: WorkoutExercise;
  exerciseLog: ExerciseLog | undefined;
  lastWorkoutLog?: ExerciseLog;
  onSetComplete: (setNumber: number, set: SetLog) => void;
  onShowInfo: () => void;
  restSeconds: number;
  onStartRest: (seconds: number) => void;
}

export function ExerciseItem({
  workoutExercise,
  exerciseLog,
  lastWorkoutLog,
  onSetComplete,
  onShowInfo,
  onStartRest,
}: ExerciseItemProps) {
  const [expanded, setExpanded] = useState(true);
  const exercise = getExercise(workoutExercise.exerciseId);

  if (!exercise) return null;

  const completedSets = exerciseLog?.sets.filter(s => s.completed).length || 0;
  const allSetsComplete = completedSets >= workoutExercise.targetSets;

  return (
    <div className={`card overflow-hidden transition-all duration-300 ${allSetsComplete ? 'opacity-60' : ''}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between text-left touch-manipulation"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-bold text-lg text-dark-900 dark:text-white">{exercise.name}</h3>
            {allSetsComplete && (
              <div className="w-6 h-6 rounded-full bg-gradient-success flex items-center justify-center">
                <Check size={14} className="text-white" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-dark-500">
              {workoutExercise.targetSets} sets × {workoutExercise.targetReps}
            </span>
            {lastWorkoutLog && lastWorkoutLog.sets[0] && (
              <span className="badge badge-brand text-2xs">
                <Zap size={10} className="mr-1" />
                Last: {lastWorkoutLog.sets[0].weight}kg
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowInfo();
            }}
            className="w-10 h-10 rounded-xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
          >
            <Info size={18} className="text-dark-500" />
          </button>
          <div className="w-8 h-8 flex items-center justify-center">
            {expanded ? (
              <ChevronUp size={20} className="text-dark-400" />
            ) : (
              <ChevronDown size={20} className="text-dark-400" />
            )}
          </div>
        </div>
      </button>

      {/* Sets */}
      {expanded && (
        <div className="px-5 pb-5 space-y-3">
          {Array.from({ length: workoutExercise.targetSets }, (_, i) => (
            <SetRow
              key={i}
              setNumber={i + 1}
              targetReps={workoutExercise.targetReps}
              currentSet={exerciseLog?.sets.find(s => s.setNumber === i + 1)}
              lastSet={lastWorkoutLog?.sets[i]}
              onComplete={(set) => {
                onSetComplete(i + 1, set);
                onStartRest(workoutExercise.restSeconds);
              }}
            />
          ))}

          {workoutExercise.notes && (
            <p className="text-sm text-dark-400 italic pt-3 border-t border-dark-100 dark:border-dark-800">
              {workoutExercise.notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface SetRowProps {
  setNumber: number;
  targetReps: string;
  currentSet?: SetLog;
  lastSet?: SetLog;
  onComplete: (set: SetLog) => void;
}

function SetRow({ setNumber, targetReps, currentSet, lastSet, onComplete }: SetRowProps) {
  const [weight, setWeight] = useState(currentSet?.weight || lastSet?.weight || 0);
  const [reps, setReps] = useState(currentSet?.reps || parseInt(targetReps) || 10);
  const isComplete = currentSet?.completed;

  const handleComplete = () => {
    onComplete({
      setNumber,
      weight,
      reps,
      completed: true,
    });
  };

  const adjustWeight = (delta: number) => {
    setWeight(prev => Math.max(0, prev + delta));
  };

  const adjustReps = (delta: number) => {
    setReps(prev => Math.max(0, prev + delta));
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200
        ${isComplete
          ? 'bg-gradient-to-r from-success-100 to-success-50 dark:from-success-900/30 dark:to-success-900/10 ring-1 ring-success-200 dark:ring-success-800/50'
          : 'bg-dark-50 dark:bg-dark-800/50'
        }
      `}
    >
      {/* Set number */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-colors
        ${isComplete
          ? 'bg-success-500 text-white'
          : 'bg-dark-200 dark:bg-dark-700 text-dark-600 dark:text-dark-300'
        }
      `}>
        {setNumber}
      </div>

      {/* Weight input */}
      <div className="flex-1 min-w-0">
        <label className="text-2xs font-semibold text-dark-400 uppercase tracking-wider block mb-1">Weight</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustWeight(-2.5)}
            className="w-9 h-9 rounded-xl bg-dark-200 dark:bg-dark-700 flex items-center justify-center active:scale-95 transition-transform touch-manipulation disabled:opacity-30"
            disabled={isComplete}
          >
            <Minus size={14} className="text-dark-500" />
          </button>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-14 text-center py-2 rounded-xl bg-white dark:bg-dark-700 border-2 border-dark-200 dark:border-dark-600 font-bold text-base text-dark-900 dark:text-white disabled:opacity-50"
            disabled={isComplete}
          />
          <button
            onClick={() => adjustWeight(2.5)}
            className="w-9 h-9 rounded-xl bg-dark-200 dark:bg-dark-700 flex items-center justify-center active:scale-95 transition-transform touch-manipulation disabled:opacity-30"
            disabled={isComplete}
          >
            <Plus size={14} className="text-dark-500" />
          </button>
        </div>
      </div>

      {/* Reps input */}
      <div className="flex-1 min-w-0">
        <label className="text-2xs font-semibold text-dark-400 uppercase tracking-wider block mb-1">Reps</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustReps(-1)}
            className="w-9 h-9 rounded-xl bg-dark-200 dark:bg-dark-700 flex items-center justify-center active:scale-95 transition-transform touch-manipulation disabled:opacity-30"
            disabled={isComplete}
          >
            <Minus size={14} className="text-dark-500" />
          </button>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(parseInt(e.target.value) || 0)}
            className="w-12 text-center py-2 rounded-xl bg-white dark:bg-dark-700 border-2 border-dark-200 dark:border-dark-600 font-bold text-base text-dark-900 dark:text-white disabled:opacity-50"
            disabled={isComplete}
          />
          <button
            onClick={() => adjustReps(1)}
            className="w-9 h-9 rounded-xl bg-dark-200 dark:bg-dark-700 flex items-center justify-center active:scale-95 transition-transform touch-manipulation disabled:opacity-30"
            disabled={isComplete}
          >
            <Plus size={14} className="text-dark-500" />
          </button>
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        disabled={isComplete}
        className={`w-12 h-12 rounded-xl transition-all touch-manipulation active:scale-95 flex items-center justify-center shadow-lg
          ${isComplete
            ? 'bg-gradient-success shadow-success-500/30'
            : 'bg-gradient-brand shadow-brand-500/30 hover:shadow-xl'
          }
        `}
      >
        <Check size={22} className="text-white" />
      </button>
    </div>
  );
}
