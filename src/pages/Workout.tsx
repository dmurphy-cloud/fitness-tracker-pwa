import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ExerciseItem } from '../components/ExerciseItem';
import { ExerciseInfoModal } from '../components/ExerciseInfoModal';
import { RestTimer } from '../components/RestTimer';
import { getExercise } from '../data/exercises';
import type { WorkoutLog, ExerciseLog, SetLog, Exercise } from '../types';

export function Workout() {
  const navigate = useNavigate();
  const {
    currentProgram,
    currentDayIndex,
    setCurrentDayIndex,
    activeWorkout,
    startWorkout,
    updateWorkout,
    completeWorkout,
    cancelWorkout,
    getLastWorkoutForDay,
  } = useApp();

  const [currentWorkout, setCurrentWorkout] = useState<WorkoutLog | null>(activeWorkout);
  const [showExerciseInfo, setShowExerciseInfo] = useState<Exercise | null>(null);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [restSeconds, setRestSeconds] = useState(120);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);

  const currentDay = currentProgram.days[currentDayIndex];

  // Get last workout for this day to show previous weights
  const lastWorkout = getLastWorkoutForDay(currentDay?.id);
  const lastExerciseLogs = lastWorkout?.exercises || [];

  useEffect(() => {
    setCurrentWorkout(activeWorkout);
  }, [activeWorkout]);

  const handleStartWorkout = async () => {
    if (currentDay) {
      const workout = await startWorkout(currentDay.id);
      setCurrentWorkout(workout);
    }
  };

  const handleSetComplete = (exerciseId: string, setNumber: number, set: SetLog) => {
    if (!currentWorkout) return;

    const existingExerciseIndex = currentWorkout.exercises.findIndex(
      e => e.exerciseId === exerciseId
    );

    let updatedExercises: ExerciseLog[];

    if (existingExerciseIndex >= 0) {
      // Update existing exercise log
      updatedExercises = currentWorkout.exercises.map((e, i) => {
        if (i !== existingExerciseIndex) return e;

        const existingSetIndex = e.sets.findIndex(s => s.setNumber === setNumber);
        const updatedSets = existingSetIndex >= 0
          ? e.sets.map((s, si) => si === existingSetIndex ? set : s)
          : [...e.sets, set];

        return { ...e, sets: updatedSets };
      });
    } else {
      // Create new exercise log
      updatedExercises = [
        ...currentWorkout.exercises,
        { exerciseId, sets: [set] },
      ];
    }

    const updated: WorkoutLog = {
      ...currentWorkout,
      exercises: updatedExercises,
    };

    setCurrentWorkout(updated);
    updateWorkout(updated);
  };

  const handleStartRest = (seconds: number) => {
    setRestSeconds(seconds);
    setShowRestTimer(true);
  };

  const handleCompleteWorkout = async () => {
    if (currentWorkout) {
      await completeWorkout(currentWorkout);
      navigate('/');
    }
  };

  const handleCancelWorkout = async () => {
    await cancelWorkout();
    navigate('/');
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev'
      ? (currentDayIndex - 1 + currentProgram.days.length) % currentProgram.days.length
      : (currentDayIndex + 1) % currentProgram.days.length;
    setCurrentDayIndex(newIndex);
  };

  // Calculate progress
  const totalSets = currentDay?.exercises.reduce((sum, e) => sum + e.targetSets, 0) || 0;
  const completedSets = currentWorkout?.exercises.reduce(
    (sum, e) => sum + e.sets.filter(s => s.completed).length, 0
  ) || 0;
  const progress = totalSets > 0 ? (completedSets / totalSets) * 100 : 0;

  // Calculate duration
  const startTime = currentWorkout?.startTime ? new Date(currentWorkout.startTime) : null;
  const duration = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0;
  const durationMinutes = Math.floor(duration / 60);

  if (!currentDay) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-950">
        <p className="text-dark-400">No workout day found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-safe-top bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-700/50 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 touch-manipulation text-dark-600 dark:text-dark-300 hover:text-brand-500 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>

            {/* Day selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateDay('prev')}
                className="p-2 touch-manipulation text-dark-500 hover:text-brand-500 transition-colors"
                disabled={!!currentWorkout}
              >
                <ChevronLeft size={20} className={currentWorkout ? 'opacity-30' : ''} />
              </button>
              <span className="font-bold text-lg min-w-[140px] text-center text-dark-900 dark:text-white">
                {currentDay.name}
              </span>
              <button
                onClick={() => navigateDay('next')}
                className="p-2 touch-manipulation text-dark-500 hover:text-brand-500 transition-colors"
                disabled={!!currentWorkout}
              >
                <ChevronRight size={20} className={currentWorkout ? 'opacity-30' : ''} />
              </button>
            </div>

            {currentWorkout ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="p-2 text-red-500 touch-manipulation hover:text-red-400 transition-colors"
              >
                <X size={24} />
              </button>
            ) : (
              <div className="w-10" />
            )}
          </div>

          {/* Progress bar */}
          {currentWorkout && (
            <div className="mt-3">
              <div className="flex justify-between text-sm text-dark-500 dark:text-dark-400 mb-1">
                <span className="font-medium">{completedSets}/{totalSets} sets</span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {durationMinutes} min
                </span>
              </div>
              <div className="h-2 bg-dark-200 dark:bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-brand rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="px-4 py-4">
        {/* Not started state */}
        {!currentWorkout && (
          <div className="text-center py-8">
            <h2 className="text-xl font-bold mb-2 text-dark-900 dark:text-white">{currentDay.name}</h2>
            <p className="text-dark-500 dark:text-dark-400 mb-6">
              {currentDay.exercises.length} exercises • {totalSets} total sets
            </p>

            <button
              onClick={handleStartWorkout}
              className="btn-brand text-lg px-8"
            >
              Start Workout
            </button>

            {/* Exercise preview */}
            <div className="mt-8 text-left">
              <h3 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-3">
                Exercises
              </h3>
              <div className="space-y-2">
                {currentDay.exercises.map((we) => {
                  const exercise = getExercise(we.exerciseId);
                  if (!exercise) return null;
                  return (
                    <div key={we.exerciseId} className="card p-4">
                      <p className="font-semibold text-dark-900 dark:text-white">{exercise.name}</p>
                      <p className="text-sm text-dark-500 dark:text-dark-400">
                        {we.targetSets} sets × {we.targetReps}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Active workout */}
        {currentWorkout && (
          <div className="space-y-4">
            {currentDay.exercises.map((we) => {
              const exerciseLog = currentWorkout.exercises.find(
                e => e.exerciseId === we.exerciseId
              );
              const lastExerciseLog = lastExerciseLogs.find(
                e => e.exerciseId === we.exerciseId
              );
              const exercise = getExercise(we.exerciseId);

              return (
                <ExerciseItem
                  key={we.exerciseId}
                  workoutExercise={we}
                  exerciseLog={exerciseLog}
                  lastWorkoutLog={lastExerciseLog}
                  onSetComplete={(setNum, set) => handleSetComplete(we.exerciseId, setNum, set)}
                  onShowInfo={() => exercise && setShowExerciseInfo(exercise)}
                  restSeconds={we.restSeconds}
                  onStartRest={handleStartRest}
                />
              );
            })}

            {/* Complete workout button */}
            <button
              onClick={() => setShowCompleteConfirm(true)}
              className="w-full btn-success flex items-center justify-center gap-2 mt-6"
            >
              <Check size={24} />
              Complete Workout
            </button>
          </div>
        )}
      </main>

      {/* Rest Timer Modal */}
      {showRestTimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 m-4 max-w-sm w-full shadow-2xl border border-dark-200 dark:border-dark-700">
            <RestTimer
              defaultSeconds={restSeconds}
              onComplete={() => {
                // Optional: could auto-dismiss
              }}
            />
            <button
              onClick={() => setShowRestTimer(false)}
              className="w-full mt-4 btn-secondary"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Exercise Info Modal */}
      {showExerciseInfo && (
        <ExerciseInfoModal
          exercise={showExerciseInfo}
          onClose={() => setShowExerciseInfo(null)}
        />
      )}

      {/* Cancel Confirm Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 m-4 max-w-sm w-full shadow-2xl border border-dark-200 dark:border-dark-700">
            <h3 className="text-xl font-bold mb-2 text-dark-900 dark:text-white">Cancel Workout?</h3>
            <p className="text-dark-500 dark:text-dark-400 mb-6">
              Are you sure you want to cancel this workout? All progress will be lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Keep Going
              </button>
              <button
                onClick={handleCancelWorkout}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-200"
              >
                Cancel Workout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Complete Confirm Modal */}
      {showCompleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-800 rounded-3xl p-6 m-4 max-w-sm w-full shadow-2xl border border-dark-200 dark:border-dark-700">
            <h3 className="text-xl font-bold mb-2 text-dark-900 dark:text-white">Complete Workout?</h3>
            <p className="text-dark-500 dark:text-dark-400 mb-2">
              {completedSets}/{totalSets} sets completed
            </p>
            {completedSets < totalSets && (
              <p className="text-amber-600 dark:text-amber-400 text-sm mb-4">
                You still have {totalSets - completedSets} sets remaining.
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteConfirm(false)}
                className="flex-1 btn-secondary"
              >
                Continue
              </button>
              <button
                onClick={handleCompleteWorkout}
                className="flex-1 btn-success"
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
