import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Download, ListChecks } from 'lucide-react';
import { useInterviews } from '../hooks/useInterviews';
import { Input, Select } from '../components/Field';
import Button from '../components/Button';
import InterviewRow from '../components/InterviewRow';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import { ROUND_OPTIONS, RESULT_OPTIONS } from '../utils/constants';
import { interviewsToCsv, downloadCsv } from '../utils/csv';

export default function Interviews() {
  const [search, setSearch] = useState('');
  const [result, setResult] = useState('');
  const [round, setRound] = useState('');
  const [sort, setSort] = useState('newest');

  const params = useMemo(() => {
    const p = { sort };
    if (search.trim()) p.search = search.trim();
    if (result) p.result = result;
    if (round) p.round = round;
    return p;
  }, [search, result, round, sort]);

  const { interviews, loading, error } = useInterviews(params);
  const hasFilters = search || result || round;

  function handleExport() {
    if (interviews.length === 0) return;
    downloadCsv(`interviews-${new Date().toISOString().slice(0, 10)}.csv`, interviewsToCsv(interviews));
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Interviews</h1>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport} disabled={interviews.length === 0}>
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Link to="/interviews/new">
            <Button><Plus className="h-4 w-4" /> Add Interview</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            className="pl-9"
            placeholder="Search by company or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select className="sm:w-40" value={result} onChange={(e) => setResult(e.target.value)}>
          <option value="">All results</option>
          {RESULT_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </Select>
        <Select className="sm:w-40" value={round} onChange={(e) => setRound(e.target.value)}>
          <option value="">All rounds</option>
          {ROUND_OPTIONS.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </Select>
        <Select className="sm:w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest rating</option>
          <option value="lowest">Lowest rating</option>
        </Select>
      </div>

      {error && <Alert>{error}</Alert>}

      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : interviews.length === 0 ? (
        hasFilters ? (
          <EmptyState
            icon={Search}
            title="No interviews match your filters."
            description="Try adjusting your search or filters."
          />
        ) : (
          <EmptyState
            icon={ListChecks}
            title="Your interview journey starts here."
            description="Log your first interview and start tracking what you learn."
            action={
              <Link to="/interviews/new">
                <Button className="mt-2"><Plus className="h-4 w-4" /> Add First Interview</Button>
              </Link>
            }
          />
        )
      ) : (
        <div className="flex flex-col gap-2">
          {interviews.map((interview) => (
            <InterviewRow key={interview._id} interview={interview} />
          ))}
        </div>
      )}
    </div>
  );
}
