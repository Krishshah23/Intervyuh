import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ListChecks, PlusCircle, BarChart3, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/interviews', label: 'Interviews', icon: ListChecks },
  { to: '/interviews/new', label: 'Add', icon: PlusCircle },
  { to: '/insights', label: 'Insights', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function navLinkClass({ isActive }) {
  return `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900'
  }`;
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-8">
            <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Interview Journal
            </span>
            <nav className="hidden items-center gap-1 md:flex">
              {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} className={navLinkClass} end={to === '/dashboard'}>
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <span className="hidden text-sm text-zinc-500 sm:inline dark:text-zinc-400">{user?.name}</span>
            <button
              onClick={logout}
              aria-label="Log out"
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:px-6 md:pb-6">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-zinc-200 bg-white py-2 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-xs font-medium ${
                isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'
              }`
            }
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
