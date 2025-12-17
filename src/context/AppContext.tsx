import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  UserProfile,
  WorkoutProgram,
  WorkoutLog,
  WeightEntry,
} from '../types';
import {
  getUserProfile,
  saveUserProfile,
  getAllWorkoutLogs,
  saveWorkoutLog,
  deleteWorkoutLog,
  getAllWeightEntries,
  saveWeightEntry,
  deleteWeightEntry,
  getAppState,
  saveAppState,
  generateId,
} from '../db/database';
import { defaultProgram } from '../data/programs';

interface AppContextType {
  // User
  profile: UserProfile | null;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;

  // Programs
  currentProgram: WorkoutProgram;
  currentDayIndex: number;
  setCurrentDayIndex: (index: number) => void;

  // Workouts
  workoutLogs: WorkoutLog[];
  activeWorkout: WorkoutLog | null;
  startWorkout: (dayId: string) => Promise<WorkoutLog>;
  updateWorkout: (workout: WorkoutLog) => Promise<void>;
  completeWorkout: (workout: WorkoutLog) => Promise<void>;
  cancelWorkout: () => void;
  removeWorkoutLog: (id: string) => Promise<void>;
  getLastWorkoutForDay: (dayId: string) => WorkoutLog | undefined;

  // Weight
  weightEntries: WeightEntry[];
  addWeightEntry: (weight: number, notes?: string, bodyFat?: number) => Promise<void>;
  removeWeightEntry: (id: string) => Promise<void>;

  // UI State
  darkMode: boolean;
  toggleDarkMode: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultProfile: UserProfile = {
  id: 'default',
  name: 'User',
  currentWeight: 94,
  goalWeight: 80,
  startDate: new Date().toISOString().split('T')[0],
  unitSystem: 'metric',
  restTimerDefault: 120,
  darkMode: false,
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [activeWorkout, setActiveWorkout] = useState<WorkoutLog | null>(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize app state from IndexedDB
  useEffect(() => {
    async function loadData() {
      try {
        // Load profile
        let userProfile = await getUserProfile();
        if (!userProfile) {
          userProfile = defaultProfile;
          await saveUserProfile(userProfile);
        }
        setProfile(userProfile);
        setDarkMode(userProfile.darkMode);

        // Load workout logs
        const logs = await getAllWorkoutLogs();
        setWorkoutLogs(logs.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));

        // Load weight entries
        const weights = await getAllWeightEntries();
        setWeightEntries(weights);

        // Load app state
        const appState = await getAppState();
        if (appState) {
          setCurrentDayIndex(appState.currentDayIndex);
          if (appState.activeWorkoutId) {
            const activeLog = logs.find(l => l.id === appState.activeWorkoutId && !l.completed);
            if (activeLog) {
              setActiveWorkout(activeLog);
            }
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updates };
    await saveUserProfile(newProfile);
    setProfile(newProfile);
    if (updates.darkMode !== undefined) {
      setDarkMode(updates.darkMode);
    }
  }, [profile]);

  const toggleDarkMode = useCallback(async () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (profile) {
      await updateProfile({ darkMode: newDarkMode });
    }
  }, [darkMode, profile, updateProfile]);

  const startWorkout = useCallback(async (dayId: string): Promise<WorkoutLog> => {
    const workout: WorkoutLog = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      workoutDayId: dayId,
      programId: defaultProgram.id,
      exercises: [],
      completed: false,
      startTime: new Date().toISOString(),
    };
    await saveWorkoutLog(workout);
    await saveAppState({
      currentProgramId: defaultProgram.id,
      currentDayIndex,
      activeWorkoutId: workout.id,
    });
    setActiveWorkout(workout);
    setWorkoutLogs(prev => [workout, ...prev]);
    return workout;
  }, [currentDayIndex]);

  const updateWorkout = useCallback(async (workout: WorkoutLog) => {
    await saveWorkoutLog(workout);
    setActiveWorkout(workout);
    setWorkoutLogs(prev =>
      prev.map(w => w.id === workout.id ? workout : w)
    );
  }, []);

  const completeWorkout = useCallback(async (workout: WorkoutLog) => {
    const completedWorkout: WorkoutLog = {
      ...workout,
      completed: true,
      endTime: new Date().toISOString(),
      duration: workout.startTime
        ? Math.floor((Date.now() - new Date(workout.startTime).getTime()) / 1000)
        : undefined,
    };
    await saveWorkoutLog(completedWorkout);
    await saveAppState({
      currentProgramId: defaultProgram.id,
      currentDayIndex,
      activeWorkoutId: undefined,
    });
    setActiveWorkout(null);
    setWorkoutLogs(prev =>
      prev.map(w => w.id === completedWorkout.id ? completedWorkout : w)
    );
  }, [currentDayIndex]);

  const cancelWorkout = useCallback(async () => {
    if (activeWorkout) {
      await deleteWorkoutLog(activeWorkout.id);
      setWorkoutLogs(prev => prev.filter(w => w.id !== activeWorkout.id));
    }
    setActiveWorkout(null);
    await saveAppState({
      currentProgramId: defaultProgram.id,
      currentDayIndex,
      activeWorkoutId: undefined,
    });
  }, [activeWorkout, currentDayIndex]);

  const removeWorkoutLog = useCallback(async (id: string) => {
    await deleteWorkoutLog(id);
    setWorkoutLogs(prev => prev.filter(w => w.id !== id));
  }, []);

  const getLastWorkoutForDay = useCallback((dayId: string): WorkoutLog | undefined => {
    return workoutLogs.find(w => w.workoutDayId === dayId && w.completed);
  }, [workoutLogs]);

  const addWeightEntry = useCallback(async (weight: number, notes?: string, bodyFat?: number) => {
    const entry: WeightEntry = {
      id: generateId(),
      date: new Date().toISOString().split('T')[0],
      weight,
      notes,
      bodyFatPercent: bodyFat,
    };
    await saveWeightEntry(entry);
    setWeightEntries(prev => [...prev, entry].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ));

    // Update current weight in profile
    if (profile) {
      await updateProfile({ currentWeight: weight });
    }
  }, [profile, updateProfile]);

  const removeWeightEntry = useCallback(async (id: string) => {
    await deleteWeightEntry(id);
    setWeightEntries(prev => prev.filter(w => w.id !== id));
  }, []);

  const value: AppContextType = {
    profile,
    updateProfile,
    currentProgram: defaultProgram,
    currentDayIndex,
    setCurrentDayIndex,
    workoutLogs,
    activeWorkout,
    startWorkout,
    updateWorkout,
    completeWorkout,
    cancelWorkout,
    removeWorkoutLog,
    getLastWorkoutForDay,
    weightEntries,
    addWeightEntry,
    removeWeightEntry,
    darkMode,
    toggleDarkMode,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
