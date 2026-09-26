import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { fetchInterview, deleteInterview } from '../services/interviewService';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import Alert from '../components/Alert';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate } from '../utils/format';

const SECTIONS = [
  { key: 'wentWell', label: 'What Went Well' },
  { key: 'wentWrong', label: 'What Went Wrong' },
  { key: 'questionsICouldntAnswer', label: "Questions I Couldn't Answer" },
  { key: 'keyLearning', label: 'Key Learning' },
  { key: 'whatToImprove', label: 'What Should I Improve?' },
  { key: 'topicsToPrepare', label: 'Topics To Prepare' },
  { key: 'additionalNotes', label: 'Additional Notes' },
];

export default function InterviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchInterview(id)
      .then(setInterview)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteInterview(id);
      navigate('/interviews', { replace: true });
    } catch (err) {
      setError(err.message);
      setDeleting(false);
      setConfirmOpen(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error && !interview) {
    return <Alert>{error}</Alert>;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Link to="/interviews" className="inline-flex w-fit items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
        <ArrowLeft className="h-4 w-4" /> Back to interviews
      </Link>

      {error && <Alert>{error}</Alert>}

      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{interview.company}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">{interview.role}</p>
            <p className="mt-1 text-xs text-zinc-400">{formatDate(interview.date)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{interview.rating}/10</span>
            <Badge result={interview.result} />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Interview Overview</h2>
        <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
          <Detail label="Company" value={interview.company} />
          <Detail label="Role" value={interview.role} />
          <Detail label="Date" value={formatDate(interview.date)} />
          <Detail label="Round" value={interview.round} />
          <Detail label="Result" value={interview.result} />
          <Detail label="Overall Rating" value={`${interview.rating}/10`} />
        </dl>
      </Card>

      {SECTIONS.filter((s) => interview[s.key]?.trim()).map((s) => (
        <Card key={s.key}>
          <h2 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.label}</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{interview[s.key]}</p>
        </Card>
      ))}

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => navigate(`/interviews/${id}/edit`)}>
          <Pencil className="h-4 w-4" /> Edit
        </Button>
        <Button variant="danger" onClick={() => setConfirmOpen(true)}>
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this interview?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-zinc-400">{label}</dt>
      <dd className="font-medium text-zinc-800 dark:text-zinc-200">{value}</dd>
    </div>
  );
}
