export function Field({ label, htmlFor, error, hint, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-zinc-400">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

const baseInputClasses =
  'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-400 dark:focus:ring-zinc-400';

export function Input({ error, className = '', ...props }) {
  return (
    <input
      className={`${baseInputClasses} ${error ? 'border-red-400 dark:border-red-500' : ''} ${className}`}
      {...props}
    />
  );
}

export function Textarea({ error, className = '', rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`${baseInputClasses} resize-y ${error ? 'border-red-400 dark:border-red-500' : ''} ${className}`}
      {...props}
    />
  );
}

export function Select({ error, className = '', children, ...props }) {
  return (
    <select
      className={`${baseInputClasses} ${error ? 'border-red-400 dark:border-red-500' : ''} ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
