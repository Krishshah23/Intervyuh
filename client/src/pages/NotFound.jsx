import { Link } from 'react-router-dom';
import Button from '../components/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-medium text-zinc-400">404</p>
      <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Page not found</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard">
        <Button className="mt-2">Back to Dashboard</Button>
      </Link>
    </div>
  );
}
