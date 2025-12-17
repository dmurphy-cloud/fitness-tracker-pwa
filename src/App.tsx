import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Home } from './pages/Home';
import { Workout } from './pages/Workout';
import { Exercises } from './pages/Exercises';
import { Progress } from './pages/Progress';
import { Profile } from './pages/Profile';

function AppContent() {
  const { isLoading } = useApp();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white animate-pulse"
              viewBox="0 0 512 512"
              fill="currentColor"
            >
              <rect x="100" y="226" width="60" height="60" rx="8"/>
              <rect x="352" y="226" width="60" height="60" rx="8"/>
              <rect x="160" y="246" width="192" height="20" rx="4"/>
              <rect x="80" y="196" width="40" height="120" rx="6"/>
              <rect x="392" y="196" width="40" height="120" rx="6"/>
            </svg>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Loading FitTrack...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Navigation />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
