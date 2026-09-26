import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import InterviewForm from '../components/InterviewForm';
import Button from '../components/Button';
import { createInterview } from '../services/interviewService';

export default function AddInterview() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(null);

  async function handleSubmit(form) {
    const interview = await createInterview(form);
    setSaved(interview);
  }

  if (saved) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" strokeWidth={1.5} />
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Interview saved successfully.</h1>
        <div className="mt-2 flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
          <Button onClick={() => navigate(`/interviews/${saved._id}`)}>View Interview</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-100">Add Interview</h1>
      <InterviewForm onSubmit={handleSubmit} submitLabel="Save Interview" />
    </div>
  );
}
