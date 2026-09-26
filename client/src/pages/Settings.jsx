import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Settings() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Settings</h1>

      <Card className="flex flex-col gap-4">
        <div>
          <p className="text-xs text-zinc-400">Name</p>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user?.name}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400">Email</p>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{user?.email}</p>
        </div>
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Theme</p>
          <p className="text-xs text-zinc-400">Switch between light and dark mode</p>
        </div>
        <Button variant="secondary" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </Button>
      </Card>

      <Button variant="secondary" onClick={handleLogout} className="w-full">
        <LogOut className="h-4 w-4" /> Logout
      </Button>
    </div>
  );
}
