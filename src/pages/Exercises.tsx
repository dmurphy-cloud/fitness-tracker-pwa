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
    <div className="min-h-screen pb-24 pt-safe-top bg-gray-50 dark:bg-dark-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-dark-700/50 px-4 py-3 safe-area-top">
        <h1 className="text-2xl font-bold mb-3 text-dark-900 dark:text-white">Exercise Library</h1>

        {/* Search */}
        <div className="relative">
          <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
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
              <X size={18} className="text-dark-400" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`mt-3 flex items-center gap-2 px-4 py-2 rounded-xl transition-colors touch-manipulation font-medium
            ${showFilters || hasActiveFilters
              ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
              : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-300'
            }
          `}
        >
          <Filter size={18} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-gradient-brand text-white text-xs rounded-full font-semibold">
              {[selectedMuscle, selectedEquipment, searchQuery].filter(Boolean).length}
            </span>
          )}
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 space-y-4">
            {/* Muscle groups */}
            <div>
              <label className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase mb-2 block">
                Muscle Group
              </label>
              <div className="flex flex-wrap gap-2">
                {muscleGroups.map(muscle => (
                  <button
                    key={muscle}
                    onClick={() => setSelectedMuscle(selectedMuscle === muscle ? null : muscle)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-all touch-manipulation
                      ${selectedMuscle === muscle
                        ? 'bg-gradient-brand text-white shadow-lg shadow-brand-500/25'
                        : 'bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600'
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
              <label className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase mb-2 block">
                Equipment
              </label>
              <div className="flex flex-wrap gap-2">
                {equipmentTypes.map(equipment => (
                  <button
                    key={equipment}
                    onClick={() => setSelectedEquipment(selectedEquipment === equipment ? null : equipment)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium capitalize transition-all touch-manipulation
                      ${selectedEquipment === equipment
                        ? 'bg-gradient-brand text-white shadow-lg shadow-brand-500/25'
                        : 'bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-600'
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
                className="text-sm text-brand-600 dark:text-brand-400 font-semibold touch-manipulation hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </header>

      <main className="px-4 py-4">
        {/* Results count */}
        <p className="text-sm text-dark-500 dark:text-dark-400 mb-4">
          {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
        </p>

        {/* Grouped exercises */}
        {Object.entries(groupedExercises).map(([muscle, muscleExercises]) => (
          <div key={muscle} className="mb-6">
            <h2 className="text-sm font-semibold text-dark-500 dark:text-dark-400 uppercase tracking-wide mb-3 capitalize">
              {muscle}
            </h2>
            <div className="space-y-2">
              {muscleExercises.map(exercise => (
                <button
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  className="card w-full p-4 text-left active:scale-[0.98] transition-transform touch-manipulation"
                >
                  <h3 className="font-bold mb-2 text-dark-900 dark:text-white">{exercise.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {exercise.muscleGroups.slice(0, 3).map(m => (
                      <span
                        key={m}
                        className="badge-brand"
                      >
                        {m}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400 rounded-lg text-xs font-medium capitalize">
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
            <p className="text-dark-500 dark:text-dark-400 mb-4">
              No exercises found matching your filters.
            </p>
            <button
              onClick={clearFilters}
              className="btn-secondary"
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
