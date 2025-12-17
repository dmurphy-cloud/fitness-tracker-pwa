import { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { exercises } from '../data/exercises';
import { ExerciseInfoModal } from '../components/ExerciseInfoModal';
import type { Exercise, MuscleGroup, Equipment } from '../types';

const muscleGroups: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'abs', 'quads', 'hamstrings', 'glutes', 'calves', 'lats', 'traps'
];

const equipmentTypes: Equipment[] = [
  'barbell', 'dumbbell', 'cable', 'machine', 'bodyweight'
];

export function Exercises() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredExercises = useMemo(() => {
    return exercises.filter(exercise => {
      const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMuscle = !selectedMuscle || exercise.muscleGroups.includes(selectedMuscle);
      const matchesEquipment = !selectedEquipment || exercise.equipment === selectedEquipment;
      return matchesSearch && matchesMuscle && matchesEquipment;
    });
  }, [searchQuery, selectedMuscle, selectedEquipment]);

  const groupedExercises = useMemo(() => {
    const groups: Record<string, Exercise[]> = {};
    filteredExercises.forEach(exercise => {
      const primaryMuscle = exercise.muscleGroups[0];
      if (!groups[primaryMuscle]) {
        groups[primaryMuscle] = [];
      }
      groups[primaryMuscle].push(exercise);
    });
    return groups;
  }, [filteredExercises]);

  const clearFilters = () => {
    setSelectedMuscle(null);
    setSelectedEquipment(null);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedMuscle || selectedEquipment || searchQuery;

  return (
    <div className="min-h-screen pb-24 pt-safe-top">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 safe-area-top">
        <h1 className="text-2xl font-bold mb-3">Exercise Library</h1>

        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 touch-manipulation"
            >
              <X size={18} className="text-slate-400" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl transition-colors touch-manipulation
            ${showFilters || hasActiveFilters
              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
              : 'bg-slate-100 dark:bg-slate-700'
            }
          `}
        >
          <Filter size={18} />
          <span className="font-medium">Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-primary-500 text-white text-xs rounded-full">
              {[selectedMuscle, selectedEquipment, searchQuery].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 space-y-4">
            {/* Muscle groups */}
            <div>
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                Muscle Group
              </label>
              <div className="flex flex-wrap gap-2">
                {muscleGroups.map(muscle => (
                  <button
                    key={muscle}
                    onClick={() => setSelectedMuscle(selectedMuscle === muscle ? null : muscle)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors touch-manipulation
                      ${selectedMuscle === muscle
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }
                    `}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2 block">
                Equipment
              </label>
              <div className="flex flex-wrap gap-2">
                {equipmentTypes.map(equipment => (
                  <button
                    key={equipment}
                    onClick={() => setSelectedEquipment(selectedEquipment === equipment ? null : equipment)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors touch-manipulation
                      ${selectedEquipment === equipment
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }
                    `}
                  >
                    {equipment}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 dark:text-primary-400 font-medium touch-manipulation"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </header>

      <main className="px-4 py-4">
        {/* Results count */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
        </p>

        {/* Grouped exercises */}
        {Object.entries(groupedExercises).map(([muscle, muscleExercises]) => (
          <div key={muscle} className="mb-6">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 capitalize">
              {muscle}
            </h2>
            <div className="space-y-2">
              {muscleExercises.map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className="card w-full p-4 text-left active:scale-[0.98] transition-transform touch-manipulation"
                >
                  <h3 className="font-bold mb-1">{exercise.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {exercise.muscleGroups.slice(0, 3).map(m => (
                      <span
                        key={m}
                        className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded text-xs font-medium capitalize"
                      >
                        {m}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded text-xs font-medium capitalize">
                      {exercise.equipment}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              No exercises found matching your filters.
            </p>
            <button
              onClick={clearFilters}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Exercise Info Modal */}
      {selectedExercise && (
        <ExerciseInfoModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}
