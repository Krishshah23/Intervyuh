import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import InterviewForm from '../components/InterviewForm';
import { fetchInterview, updateInterview } from '../services/interviewService';
import Skeleton from '../components/Skeleton';
import Alert from '../components/Alert';
import { toDateInputValue } from '../utils/format';

export default function EditInterview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterview(id)
      .then((interview) => setInitialValues({ ...interview, date: toDateInputValue(interview.date) }))
      .catch((err) => setError(err.message));
  }, [id]);

  async function handleSubmit(form) {
    await updateInterview(id, form);
    navigate(`/interviews/${id}`);
  }

  if (error) return <Alert>{error}</Alert>;
  if (!initialValues) return <Skeleton className="h-96" />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to={`/interviews/${id}`} className="mb-4 inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
        <ArrowLeft className="h-4 w-4" /> Back
      </Link>
      <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Edit Interview</h1>
      <InterviewForm initialValues={initialValues} onSubmit={handleSubmit} submitLabel="Save Changes" />
    </div>
  );
}
