import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type {
  WorkoutLog,
  WeightEntry,
  UserProfile,
  WorkoutProgram,
} from '../types';

interface AppStateDB {
  id: string;
  currentProgramId: string;
  currentDayIndex: number;
  activeWorkoutId?: string;
}

interface FitTrackDB extends DBSchema {
  workoutLogs: {
    key: string;
    value: WorkoutLog;
    indexes: { 'by-date': string };
  };
  weightEntries: {
    key: string;
    value: WeightEntry;
    indexes: { 'by-date': string };
  };
  userProfile: {
    key: string;
    value: UserProfile;
  };
  appState: {
    key: string;
    value: AppStateDB;
  };
  customPrograms: {
    key: string;
    value: WorkoutProgram;
  };
}

const DB_NAME = 'fittrack-db';
const DB_VERSION = 1;

let dbInstance: IDBPDatabase<FitTrackDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<FitTrackDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<FitTrackDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Workout logs store
      if (!db.objectStoreNames.contains('workoutLogs')) {
        const workoutStore = db.createObjectStore('workoutLogs', {
          keyPath: 'id',
        });
        workoutStore.createIndex('by-date', 'date');
      }

      // Weight entries store
      if (!db.objectStoreNames.contains('weightEntries')) {
        const weightStore = db.createObjectStore('weightEntries', {
          keyPath: 'id',
        });
        weightStore.createIndex('by-date', 'date');
      }

      // User profile store
      if (!db.objectStoreNames.contains('userProfile')) {
        db.createObjectStore('userProfile', { keyPath: 'id' });
      }

      // App state store
      if (!db.objectStoreNames.contains('appState')) {
        db.createObjectStore('appState', { keyPath: 'id' });
      }

      // Custom programs store
      if (!db.objectStoreNames.contains('customPrograms')) {
        db.createObjectStore('customPrograms', { keyPath: 'id' });
      }
    },
  });

  return dbInstance;
}

// Workout Logs
export async function saveWorkoutLog(log: WorkoutLog): Promise<void> {
  const db = await getDB();
  await db.put('workoutLogs', log);
}

export async function getWorkoutLog(id: string): Promise<WorkoutLog | undefined> {
  const db = await getDB();
  return db.get('workoutLogs', id);
}

export async function getAllWorkoutLogs(): Promise<WorkoutLog[]> {
  const db = await getDB();
  return db.getAll('workoutLogs');
}

export async function getWorkoutLogsByDateRange(
  startDate: string,
  endDate: string
): Promise<WorkoutLog[]> {
  const db = await getDB();
  const index = db.transaction('workoutLogs').store.index('by-date');
  return index.getAll(IDBKeyRange.bound(startDate, endDate));
}

export async function deleteWorkoutLog(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('workoutLogs', id);
}

// Weight Entries
export async function saveWeightEntry(entry: WeightEntry): Promise<void> {
  const db = await getDB();
  await db.put('weightEntries', entry);
}

export async function getWeightEntry(id: string): Promise<WeightEntry | undefined> {
  const db = await getDB();
  return db.get('weightEntries', id);
}

export async function getAllWeightEntries(): Promise<WeightEntry[]> {
  const db = await getDB();
  const entries = await db.getAll('weightEntries');
  return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function deleteWeightEntry(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('weightEntries', id);
}

// User Profile
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const db = await getDB();
  await db.put('userProfile', profile);
}

export async function getUserProfile(): Promise<UserProfile | undefined> {
  const db = await getDB();
  return db.get('userProfile', 'default');
}

// App State
export async function saveAppState(state: Omit<AppStateDB, 'id'>): Promise<void> {
  const db = await getDB();
  await db.put('appState', { id: 'default', ...state });
}

export async function getAppState(): Promise<AppStateDB | undefined> {
  const db = await getDB();
  const state = await db.get('appState', 'default');
  return state;
}

// Custom Programs
export async function saveCustomProgram(program: WorkoutProgram): Promise<void> {
  const db = await getDB();
  await db.put('customPrograms', program);
}

export async function getCustomProgram(id: string): Promise<WorkoutProgram | undefined> {
  const db = await getDB();
  return db.get('customPrograms', id);
}

export async function getAllCustomPrograms(): Promise<WorkoutProgram[]> {
  const db = await getDB();
  return db.getAll('customPrograms');
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
