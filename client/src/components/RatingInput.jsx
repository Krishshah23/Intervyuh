export default function RatingInput({ value, onChange, id }) {
  return (
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="range"
        min={1}
        max={10}
        step={0.5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-zinc-900 dark:accent-white"
      />
      <span className="w-14 shrink-0 rounded-md border border-zinc-300 px-2 py-1 text-center text-sm font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100">
        {value}/10
      </span>
    </div>
  );
}
