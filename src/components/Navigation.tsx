import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, LineChart, User, BookOpen } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/exercises', icon: BookOpen, label: 'Exercises' },
  { to: '/progress', icon: LineChart, label: 'Progress' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 safe-area-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-item flex-1 ${isActive ? 'active text-primary-600 dark:text-primary-400' : ''}`
            }
          >
            <Icon size={24} strokeWidth={2} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
