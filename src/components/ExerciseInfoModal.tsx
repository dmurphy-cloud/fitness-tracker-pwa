import { X, Target, Wrench, Lightbulb } from 'lucide-react';
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
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-t-3xl p-6 pb-safe-bottom slide-up max-h-[85vh] overflow-y-auto">
        {/* Handle */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-700 touch-manipulation"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold mb-4">{exercise.name}</h2>

          {/* Muscle groups */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <Target size={18} />
              <span className="text-sm font-semibold uppercase">Target Muscles</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {exercise.muscleGroups.map((muscle) => (
                <span
                  key={muscle}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium capitalize"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
              <Wrench size={18} />
              <span className="text-sm font-semibold uppercase">Equipment</span>
            </div>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-sm font-medium capitalize">
              {exercise.equipment}
            </span>
          </div>

          {/* Form tips */}
          <div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-3">
              <Lightbulb size={18} />
              <span className="text-sm font-semibold uppercase">Form Tips</span>
            </div>
            <ul className="space-y-3">
              {exercise.formTips.map((tip, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
