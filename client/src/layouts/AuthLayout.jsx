import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Interview Journal</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Track. Learn. Improve.</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
