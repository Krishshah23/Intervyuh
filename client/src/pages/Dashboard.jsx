import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, BookOpen } from 'lucide-react';
import { useInterviews } from '../hooks/useInterviews';
import { fetchInsights } from '../services/interviewService';
import Button from '../components/Button';
import Card from '../components/Card';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import InterviewRow from '../components/InterviewRow';
import PreInterviewChecklist from '../components/PreInterviewChecklist';

function StatCard({ label, value }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</p>
    </Card>
  );
}

export default function Dashboard() {
  const { interviews, loading } = useInterviews();
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    fetchInsights().then(setInsights).catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <EmptyState
          icon={BookOpen}
          title="Your interview journey starts here."
          description="Log your first interview and start tracking what you learn."
          action={
            <Link to="/interviews/new">
              <Button className="mt-2">
                <Plus className="h-4 w-4" /> Add First Interview
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  const total = interviews.length;
  const selected = interviews.filter((i) => i.result === 'Selected').length;
  const pending = interviews.filter((i) => i.result === 'Pending').length;
  const avgRating = (interviews.reduce((sum, i) => sum + i.rating, 0) / total).toFixed(1);
  const focus = insights?.improvementFocus?.category || '—';
  const recent = [...interviews].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total Interviews" value={total} />
        <StatCard label="Selected" value={selected} />
        <StatCard label="Pending" value={pending} />
        <StatCard label="Average Rating" value={`${avgRating}/10`} />
        <StatCard label="Improvement Focus" value={focus} />
      </div>

      {insights?.quickInsight && (
        <Card className="flex items-start gap-3 border-zinc-300 dark:border-zinc-700">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{insights.quickInsight}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Recent Interviews</h2>
            <Link to="/interviews" className="text-xs font-medium text-zinc-500 hover:underline dark:text-zinc-400">
              View all interviews
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {recent.map((interview) => (
              <InterviewRow key={interview._id} interview={interview} />
            ))}
          </div>

          {insights?.previousLearnings?.length > 0 && (
            <Card className="mt-2">
              <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Learn From Your Previous Interviews
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                {insights.previousLearnings.map((note, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-zinc-300 dark:text-zinc-600">·</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <PreInterviewChecklist />
      </div>
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Interview Journal</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Track. Learn. Improve.</p>
      </div>
      <Link to="/interviews/new">
        <Button>
          <Plus className="h-4 w-4" /> Add Interview
        </Button>
      </Link>
    </div>
  );
}
