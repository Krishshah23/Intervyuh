export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
