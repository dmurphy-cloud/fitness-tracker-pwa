import { useNavigate } from 'react-router-dom';
import { format, isToday, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Play, TrendingDown, Calendar, Flame, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkoutCard, MiniWorkoutCard } from '../components/WorkoutCard';

export function Home() {
  const navigate = useNavigate();
  const {
    profile,
    currentProgram,
    currentDayIndex,
    setCurrentDayIndex,
    workoutLogs,
    activeWorkout,
    getLastWorkoutForDay,
  } = useApp();

  // Get this week's workout completions
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const workoutsThisWeek = workoutLogs.filter(log => {
    const logDate = parseISO(log.date);
    return log.completed && logDate >= weekStart && logDate <= weekEnd;
  });

  // Calculate weight progress
  const weightToLose = profile ? profile.currentWeight - profile.goalWeight : 0;
  const progressPercent = profile
    ? Math.min(100, ((94 - profile.currentWeight) / (94 - profile.goalWeight)) * 100)
    : 0;

  // Get suggested next workout
  const todayWorkout = currentProgram.days[currentDayIndex];
  const todayLog = getLastWorkoutForDay(todayWorkout?.id);
  const completedToday = todayLog && isToday(parseISO(todayLog.date));

  // Calculate streak
  const streak = calculateStreak(workoutLogs);

  const handleStartWorkout = () => {
    if (activeWorkout) {
      navigate('/workout');
    } else {
      navigate('/workout');
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-safe-top">
      {/* Header */}
      <header className="px-5 py-6 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <p className="text-primary-200 text-sm">
          {format(today, 'EEEE, MMMM d')}
        </p>
        <h1 className="text-2xl font-bold mt-1">
          {getGreeting()}, {profile?.name || 'User'}!
        </h1>

        {/* Quick stats */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Flame size={18} className="text-orange-300" />
            <span className="font-semibold">{streak} day streak</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <Award size={18} className="text-yellow-300" />
            <span className="font-semibold">{workoutsThisWeek.length}/4 this week</span>
          </div>
        </div>
      </header>

      <main className="px-5 py-6 space-y-6">
        {/* Continue workout banner */}
        {activeWorkout && (
          <button
            onClick={() => navigate('/workout')}
            className="w-full p-4 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-2xl flex items-center justify-between active:scale-[0.98] transition-transform touch-manipulation"
          >
            <div>
              <p className="text-success-100 text-sm">Workout in progress</p>
              <p className="font-bold text-lg">Continue workout</p>
            </div>
            <Play size={32} fill="currentColor" />
          </button>
        )}

        {/* Today's workout */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            {completedToday ? "Today's Workout Complete!" : "Today's Workout"}
          </h2>

          {todayWorkout && (
            <WorkoutCard
              day={todayWorkout}
              lastLog={todayLog}
              isActive={!completedToday}
              onClick={handleStartWorkout}
            />
          )}

          {!completedToday && (
            <button
              onClick={handleStartWorkout}
              className="w-full mt-3 btn btn-primary flex items-center justify-center gap-2"
            >
              <Play size={20} fill="currentColor" />
              {activeWorkout ? 'Continue Workout' : 'Start Workout'}
            </button>
          )}
        </section>

        {/* Week overview */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
            <Calendar size={16} />
            This Week
          </h2>

          <div className="card p-4">
            <div className="flex justify-between mb-4">
              {weekDays.map((day) => {
                const dayLogs = workoutLogs.filter(
                  log => log.completed && parseISO(log.date).toDateString() === day.toDateString()
                );
                const isCompleted = dayLogs.length > 0;
                const isCurrentDay = isToday(day);

                return (
                  <div
                    key={day.toISOString()}
                    className={`flex flex-col items-center gap-1 ${isCurrentDay ? 'text-primary-600 dark:text-primary-400' : ''}`}
                  >
                    <span className="text-xs font-medium">
                      {format(day, 'EEE')}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${isCompleted
                          ? 'bg-success-500 text-white'
                          : isCurrentDay
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                            : 'bg-slate-100 dark:bg-slate-800'
                        }
                      `}
                    >
                      {format(day, 'd')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Program days quick select */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-2 px-2 pb-2">
              {currentProgram.days.map((day, index) => {
                const dayLog = getLastWorkoutForDay(day.id);
                const completed = dayLog && isToday(parseISO(dayLog.date));
                return (
                  <MiniWorkoutCard
                    key={day.id}
                    day={day}
                    completed={completed}
                    onClick={() => {
                      setCurrentDayIndex(index);
                      navigate('/workout');
                    }}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Weight progress */}
        {profile && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
              <TrendingDown size={16} />
              Weight Goal Progress
            </h2>

            <div className="card p-4">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <span className="text-3xl font-bold">{profile.currentWeight}</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">kg</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Goal: </span>
                  <span className="font-bold">{profile.goalWeight} kg</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-success-500 rounded-full progress-animate"
                  style={{ width: `${Math.max(0, progressPercent)}%` }}
                />
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {weightToLose > 0
                  ? `${weightToLose.toFixed(1)} kg to go`
                  : 'Goal reached! 🎉'
                }
              </p>
            </div>
          </section>
        )}

        {/* Recent workouts */}
        {workoutLogs.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Recent Activity
            </h2>

            <div className="space-y-2">
              {workoutLogs.slice(0, 3).map((log) => {
                const day = currentProgram.days.find(d => d.id === log.workoutDayId);
                if (!day) return null;

                return (
                  <div key={log.id} className="card p-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{day.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {format(parseISO(log.date), 'MMM d, yyyy')}
                        {log.duration && ` • ${Math.floor(log.duration / 60)} min`}
                      </p>
                    </div>
                    {log.completed && (
                      <span className="text-success-500">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function calculateStreak(logs: { date: string; completed: boolean }[]): number {
  if (logs.length === 0) return 0;

  const completedLogs = logs
    .filter(l => l.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (completedLogs.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Check if there's a workout today or yesterday to start the streak
  const lastWorkout = new Date(completedLogs[0].date);
  lastWorkout.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((currentDate.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  // Count consecutive days (allowing 1 rest day between workouts)
  const workoutDates = new Set(completedLogs.map(l => l.date.split('T')[0]));

  let checkDate = new Date(currentDate);
  let restDayUsed = false;

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toISOString().split('T')[0];

    if (workoutDates.has(dateStr)) {
      streak++;
      restDayUsed = false;
    } else if (!restDayUsed) {
      restDayUsed = true;
    } else {
      break;
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  return streak;
}
