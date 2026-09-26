export default function Alert({ children, variant = 'error' }) {
  const styles = {
    error: 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400',
  };

  return (
    <div role="alert" className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]}`}>
      {children}
    </div>
  );
}
