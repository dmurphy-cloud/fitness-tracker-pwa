import { X, Target, Dumbbell, Lightbulb } from 'lucide-react';
import type { Exercise } from '../types';

interface ExerciseInfoModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export function ExerciseInfoModal({ exercise, onClose }: ExerciseInfoModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-950/60 backdrop-blur-sm fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-t-4xl p-6 pb-safe-bottom slide-up max-h-[85vh] overflow-y-auto">
        {/* Handle */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-dark-200 dark:bg-dark-700 rounded-full" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-dark-100 dark:bg-dark-800 flex items-center justify-center touch-manipulation active:scale-95 transition-transform"
        >
          <X size={20} className="text-dark-500" />
        </button>

        {/* Content */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-dark-900 dark:text-white mb-6">{exercise.name}</h2>

          {/* Muscle groups */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
                <Target size={16} className="text-brand-500" />
              </div>
              <span className="text-sm font-bold text-dark-500 uppercase tracking-wider">Target Muscles</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {exercise.muscleGroups.map((muscle) => (
                <span
                  key={muscle}
                  className="badge badge-brand capitalize"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                <Dumbbell size={16} className="text-accent-500" />
              </div>
              <span className="text-sm font-bold text-dark-500 uppercase tracking-wider">Equipment</span>
            </div>
            <span className="px-4 py-2 bg-dark-100 dark:bg-dark-800 rounded-xl text-sm font-semibold capitalize text-dark-700 dark:text-dark-300">
              {exercise.equipment}
            </span>
          </div>

          {/* Form tips */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                <Lightbulb size={16} className="text-success-500" />
              </div>
              <span className="text-sm font-bold text-dark-500 uppercase tracking-wider">Form Tips</span>
            </div>
            <ul className="space-y-3">
              {exercise.formTips.map((tip, index) => (
                <li key={index} className="flex gap-4 p-3 rounded-2xl bg-dark-50 dark:bg-dark-800/50">
                  <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-success text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-success-500/20">
                    {index + 1}
                  </div>
                  <span className="text-dark-700 dark:text-dark-300 text-sm leading-relaxed pt-0.5">{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Close button at bottom */}
          <button
            onClick={onClose}
            className="w-full mt-6 btn btn-secondary"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
