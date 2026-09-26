import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import Card from './Card';
import { CHECKLIST_ITEMS } from '../utils/constants';

const STORAGE_KEY = 'preInterviewChecklist';

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function PreInterviewChecklist() {
  const [checked, setChecked] = useState(loadChecked);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  const completedCount = Object.values(checked).filter(Boolean).length;

  function toggle(item) {
    setChecked((prev) => ({ ...prev, [item]: !prev[item] }));
  }

  function reset() {
    setChecked({});
  }

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Before the Interview</h3>
        <button
          onClick={reset}
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>
      <p className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
        {completedCount} / {CHECKLIST_ITEMS.length} completed
      </p>
      <ul className="flex flex-col gap-2">
        {CHECKLIST_ITEMS.map((item) => (
          <li key={item}>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={!!checked[item]}
                onChange={() => toggle(item)}
                className="h-4 w-4 shrink-0 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-800"
              />
              <span className={checked[item] ? 'text-zinc-400 line-through' : ''}>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </Card>
  );
}
