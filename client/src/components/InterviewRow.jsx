import { Link } from 'react-router-dom';
import Badge from './Badge';
import { formatDate } from '../utils/format';

export default function InterviewRow({ interview }) {
  return (
    <Link
      to={`/interviews/${interview._id}`}
      className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">{interview.company}</p>
        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
          {interview.role} · {interview.round}
        </p>
      </div>
      <div className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">{formatDate(interview.date)}</div>
      <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{interview.rating}/10</div>
      <Badge result={interview.result} />
    </Link>
  );
}
