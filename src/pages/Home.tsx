import { useNavigate } from 'react-router-dom';
import { format, isToday, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { Play, Target, Calendar, Flame, Trophy, ChevronRight, Zap } from 'lucide-react';
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

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const workoutsThisWeek = workoutLogs.filter(log => {
    const logDate = parseISO(log.date);
    return log.completed && logDate >= weekStart && logDate <= weekEnd;
  });

  const weightToLose = profile ? profile.currentWeight - profile.goalWeight : 0;
  const progressPercent = profile
    ? Math.min(100, Math.max(0, ((94 - profile.currentWeight) / (94 - profile.goalWeight)) * 100))
    : 0;

  const todayWorkout = currentProgram.days[currentDayIndex];
  const todayLog = getLastWorkoutForDay(todayWorkout?.id);
  const completedToday = todayLog && isToday(parseISO(todayLog.date));

  const streak = calculateStreak(workoutLogs);

  const handleStartWorkout = () => {
    navigate('/workout');
  };

  return (
    <div className="min-h-screen pb-24 bg-dark-50 dark:bg-dark-950">
      {/* Premium Header with Mesh Gradient */}
      <header className="relative overflow-hidden safe-area-top">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-900 to-dark-950" />
        <div className="absolute inset-0 bg-mesh-dark opacity-60" />

        <div className="relative px-5 pt-6 pb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-dark-400 text-sm font-medium">
                {format(today, 'EEEE, MMMM d')}
              </p>
              <h1 className="text-2xl font-bold text-white mt-1">
                {getGreeting()}, {profile?.name || 'Athlete'}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <Zap size={24} className="text-white" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex gap-3">
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Flame size={16} className="text-accent-400" />
                <span className="text-xs font-medium text-dark-400 uppercase tracking-wide">Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">{streak} <span className="text-sm font-normal text-dark-400">days</span></p>
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={16} className="text-accent-400" />
                <span className="text-xs font-medium text-dark-400 uppercase tracking-wide">This Week</span>
              </div>
              <p className="text-2xl font-bold text-white">{workoutsThisWeek.length}<span className="text-sm font-normal text-dark-400">/4</span></p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 py-6 space-y-6 -mt-2">
        {/* Active Workout Banner */}
        {activeWorkout && (
          <button
            onClick={() => navigate('/workout')}
            className="w-full relative overflow-hidden rounded-3xl active:scale-[0.98] transition-transform touch-manipulation"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-success-500 to-success-600" />
            <div className="absolute inset-0 shimmer" />
            <div className="relative p-5 flex items-center justify-between">
              <div className="text-left">
                <p className="text-success-100 text-sm font-medium">Workout in progress</p>
                <p className="text-white font-bold text-xl mt-0.5">Continue workout</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <Play size={28} className="text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </button>
        )}

        {/* Today's Workout */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="section-header flex items-center gap-2 mb-0">
              <Target size={14} className="text-brand-500" />
              {completedToday ? "Completed Today" : "Today's Workout"}
            </h2>
            {completedToday && (
              <span className="badge badge-success">Done</span>
            )}
          </div>

          {todayWorkout && (
            <WorkoutCard
              day={todayWorkout}
              lastLog={todayLog}
              isActive={!completedToday}
              onClick={handleStartWorkout}
            />
          )}

          {!completedToday && !activeWorkout && (
            <button
              onClick={handleStartWorkout}
              className="w-full mt-4 btn btn-brand flex items-center justify-center gap-3"
            >
              <Play size={20} fill="currentColor" />
              Start Workout
            </button>
          )}
        </section>

        {/* Week Overview */}
        <section>
          <h2 className="section-header flex items-center gap-2">
            <Calendar size={14} className="text-brand-500" />
            This Week
          </h2>

          <div className="card p-5">
            {/* Calendar Row */}
            <div className="flex justify-between mb-5">
              {weekDays.map((day) => {
                const dayLogs = workoutLogs.filter(
                  log => log.completed && parseISO(log.date).toDateString() === day.toDateString()
                );
                const isCompleted = dayLogs.length > 0;
                const isCurrentDay = isToday(day);

                return (
                  <div key={day.toISOString()} className="flex flex-col items-center gap-2">
                    <span className={`text-xs font-semibold uppercase ${
                      isCurrentDay ? 'text-brand-500' : 'text-dark-400'
                    }`}>
                      {format(day, 'EEE')}
                    </span>
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all
                        ${isCompleted
                          ? 'bg-gradient-success text-white shadow-lg shadow-success-500/30'
                          : isCurrentDay
                            ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 ring-2 ring-brand-500/30'
                            : 'bg-dark-100 dark:bg-dark-800 text-dark-500'
                        }
                      `}
                    >
                      {format(day, 'd')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Workout Days Selector */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-2 px-2 pb-1">
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

        {/* Weight Progress */}
        {profile && (
          <section>
            <h2 className="section-header flex items-center gap-2">
              <Target size={14} className="text-brand-500" />
              Weight Goal
            </h2>

            <div className="card p-5">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-dark-400 text-sm font-medium mb-1">Current</p>
                  <p className="text-4xl font-bold text-dark-900 dark:text-white">
                    {profile.currentWeight}
                    <span className="text-lg font-normal text-dark-400 ml-1">kg</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-dark-400 text-sm font-medium mb-1">Goal</p>
                  <p className="text-2xl font-bold text-success-500">
                    {profile.goalWeight}
                    <span className="text-sm font-normal ml-1">kg</span>
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-dark-100 dark:bg-dark-800 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-500 to-success-500 rounded-full progress-animate"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center mt-3">
                <p className="text-sm font-medium text-dark-500">
                  {weightToLose > 0 ? `${weightToLose.toFixed(1)} kg to go` : 'Goal achieved!'}
                </p>
                <p className="text-sm font-bold text-brand-500">
                  {progressPercent.toFixed(0)}%
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Recent Activity */}
        {workoutLogs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-header mb-0">Recent Activity</h2>
              <button className="text-sm font-semibold text-brand-500 flex items-center gap-1">
                View all <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {workoutLogs.slice(0, 3).map((log) => {
                const day = currentProgram.days.find(d => d.id === log.workoutDayId);
                if (!day) return null;

                return (
                  <div key={log.id} className="card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        log.completed
                          ? 'bg-success-100 dark:bg-success-900/30'
                          : 'bg-dark-100 dark:bg-dark-800'
                      }`}>
                        {log.completed ? (
                          <Trophy size={20} className="text-success-500" />
                        ) : (
                          <Play size={20} className="text-dark-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-dark-900 dark:text-white">{day.name}</p>
                        <p className="text-sm text-dark-400">
                          {format(parseISO(log.date), 'MMM d')}
                          {log.duration && ` · ${Math.floor(log.duration / 60)} min`}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-dark-300" />
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
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const lastWorkout = new Date(completedLogs[0].date);
  lastWorkout.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((currentDate.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return 0;

  const workoutDates = new Set(completedLogs.map(l => l.date.split('T')[0]));

  const checkDate = new Date(currentDate);
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
