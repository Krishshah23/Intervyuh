import { RESULT_STYLES } from '../utils/constants';

export default function Badge({ result }) {
  const style = RESULT_STYLES[result] || 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-700';
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {result}
    </span>
  );
}
