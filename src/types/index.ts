export interface Exercise {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment;
  formTips: string[];
  videoUrl?: string;
}

export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'traps'
  | 'lats';

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'bands'
  | 'other';

export interface WorkoutExercise {
  exerciseId: string;
  targetSets: number;
  targetReps: string; // e.g., "8-12" or "10"
  restSeconds: number;
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayNumber: number;
  exercises: WorkoutExercise[];
  description?: string;
}

export interface WorkoutProgram {
  id: string;
  name: string;
  days: WorkoutDay[];
  description?: string;
}

export interface SetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string; // ISO date string
  workoutDayId: string;
  programId: string;
  exercises: ExerciseLog[];
  duration?: number; // in seconds
  notes?: string;
  completed: boolean;
  startTime?: string;
  endTime?: string;
}

export interface WeightEntry {
  id: string;
  date: string; // ISO date string
  weight: number; // in kg
  notes?: string;
  bodyFatPercent?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  currentWeight: number;
  goalWeight: number;
  height?: number; // in cm
  age?: number;
  startDate: string;
  unitSystem: 'metric' | 'imperial';
  restTimerDefault: number; // default rest time in seconds
  darkMode: boolean;
}

export interface AppState {
  currentProgramId: string;
  currentDayIndex: number;
  activeWorkoutId?: string;
}
