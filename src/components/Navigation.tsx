import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, LineChart, User, BookOpen } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/workout', icon: Dumbbell, label: 'Train' },
  { to: '/exercises', icon: BookOpen, label: 'Library' },
  { to: '/progress', icon: LineChart, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom">
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-dark-900/80 backdrop-blur-xl border-t border-dark-200/50 dark:border-dark-700/50" />

      <div className="relative flex justify-around items-center h-18 max-w-lg mx-auto px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item flex-1 py-3 ${isActive ? 'active' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-100 dark:bg-brand-900/30'
                    : ''
                }`}>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-all duration-200 ${
                      isActive
                        ? 'text-brand-500 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]'
                        : 'text-dark-400 dark:text-dark-500'
                    }`}
                  />
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-500" />
                  )}
                </div>
                <span className={`text-2xs mt-1 font-semibold tracking-wide transition-colors duration-200 ${
                  isActive
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-dark-400 dark:text-dark-500'
                }`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
