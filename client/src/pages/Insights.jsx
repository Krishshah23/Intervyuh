import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { fetchInsights } from '../services/interviewService';
import Card from '../components/Card';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Alert from '../components/Alert';
import { formatDate } from '../utils/format';

export default function Insights() {
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInsights().then(setInsights).catch((err) => setError(err.message));
  }, []);

  if (error) return <Alert>{error}</Alert>;

  if (!insights) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (insights.totalInterviews < 3) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Insights</h1>
        <EmptyState
          icon={BarChart3}
          title="Not enough data yet."
          description="Log a few interviews and we'll start showing meaningful patterns."
        />
      </div>
    );
  }

  const chartData = insights.trend.map((point) => ({ ...point, label: formatDate(point.date) }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Insights</h1>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Performance Trend</h2>
        <div className="h-64 w-full text-zinc-900 dark:text-zinc-100">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-800" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="currentColor" className="text-zinc-400" />
              <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="currentColor" className="text-zinc-400" />
              <Tooltip
                contentStyle={{ fontSize: 13, borderRadius: 8 }}
                formatter={(value) => [`${value}/10`, 'Rating']}
                labelFormatter={(label, payload) => payload?.[0]?.payload?.company || label}
              />
              <Line type="monotone" dataKey="rating" stroke="currentColor" strokeWidth={2} dot={{ r: 4, fill: 'currentColor' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Average Scores</h2>
          <div className="flex gap-8">
            <div>
              <p className="text-xs text-zinc-400">Overall</p>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{insights.averageOverall}/10</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400">Recent 5 interviews</p>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{insights.averageRecent5}/10</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Recurring Weaknesses</h2>
          {insights.recurringWeaknesses.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Keep logging interviews. Your recurring patterns will appear here after a few more interviews.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {insights.recurringWeaknesses.map(({ category, count }) => (
                <li key={category} className="flex items-center justify-between text-sm">
                  <span className="text-zinc-700 dark:text-zinc-300">{category}</span>
                  <span className="text-zinc-400">{count} interview{count > 1 ? 's' : ''}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {insights.improvementFocus && (
        <Card>
          <h2 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Current Focus</h2>
          <p className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{insights.improvementFocus.category}</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{insights.improvementFocus.message}</p>
          <div className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
            <span className="font-medium text-zinc-800 dark:text-zinc-200">Recommended action: </span>
            {insights.improvementFocus.recommendation}
          </div>
        </Card>
      )}
    </div>
  );
}
