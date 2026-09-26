export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-300 px-6 py-16 text-center dark:border-zinc-700">
      {Icon && <Icon className="h-8 w-8 text-zinc-400" strokeWidth={1.5} />}
      <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">{title}</h3>
      {description && <p className="max-w-sm text-sm text-zinc-500 dark:text-zinc-400">{description}</p>}
      {action}
    </div>
  );
}
