import { useState } from 'react';
import { ChevronDown, ChevronUp, Info, Check, Minus, Plus } from 'lucide-react';
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
    <div className={`card overflow-hidden transition-all ${allSetsComplete ? 'opacity-60' : ''}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left touch-manipulation"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{exercise.name}</h3>
            {allSetsComplete && (
              <Check size={20} className="text-success-500" />
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {workoutExercise.targetSets} sets × {workoutExercise.targetReps} reps
            {lastWorkoutLog && lastWorkoutLog.sets[0] && (
              <span className="ml-2 text-primary-600 dark:text-primary-400">
                (Last: {lastWorkoutLog.sets[0].weight}kg)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShowInfo();
            }}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 touch-manipulation"
          >
            <Info size={18} />
          </button>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {/* Sets */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
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
            <p className="text-sm text-slate-500 dark:text-slate-400 italic pt-2 border-t border-slate-200 dark:border-slate-700">
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
      className={`flex items-center gap-3 p-3 rounded-xl transition-colors
        ${isComplete
          ? 'bg-success-100 dark:bg-success-900/30'
          : 'bg-slate-50 dark:bg-slate-800/50'
        }
      `}
    >
      {/* Set number */}
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-sm">
        {setNumber}
      </div>

      {/* Weight input */}
      <div className="flex-1">
        <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Weight (kg)</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustWeight(-2.5)}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 active:scale-95 transition-transform touch-manipulation"
            disabled={isComplete}
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-16 text-center py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-lg"
            disabled={isComplete}
          />
          <button
            onClick={() => adjustWeight(2.5)}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 active:scale-95 transition-transform touch-manipulation"
            disabled={isComplete}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Reps input */}
      <div className="flex-1">
        <label className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Reps</label>
        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustReps(-1)}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 active:scale-95 transition-transform touch-manipulation"
            disabled={isComplete}
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            inputMode="numeric"
            value={reps}
            onChange={(e) => setReps(parseInt(e.target.value) || 0)}
            className="w-12 text-center py-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold text-lg"
            disabled={isComplete}
          />
          <button
            onClick={() => adjustReps(1)}
            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 active:scale-95 transition-transform touch-manipulation"
            disabled={isComplete}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        disabled={isComplete}
        className={`p-3 rounded-xl transition-all touch-manipulation active:scale-95
          ${isComplete
            ? 'bg-success-500 text-white'
            : 'bg-primary-600 text-white hover:bg-primary-700'
          }
        `}
      >
        <Check size={24} />
      </button>
    </div>
  );
}
