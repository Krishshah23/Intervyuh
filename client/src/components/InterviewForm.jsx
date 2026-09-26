import { useState } from 'react';
import Button from './Button';
import Alert from './Alert';
import { Field, Input, Select, Textarea } from './Field';
import RatingInput from './RatingInput';
import { ROUND_OPTIONS, RESULT_OPTIONS } from '../utils/constants';

const REFLECTION_FIELDS = [
  { name: 'wentWell', label: 'What went well?', placeholder: 'What did you answer confidently? What part of the interview felt strong?' },
  { name: 'wentWrong', label: 'What went wrong?', placeholder: 'Where did you struggle or make mistakes?' },
  { name: 'questionsICouldntAnswer', label: "Questions I couldn't answer", placeholder: "Add the exact questions you couldn't answer." },
  { name: 'keyLearning', label: 'Key learning', placeholder: 'What did this interview teach you?' },
  { name: 'whatToImprove', label: 'What should I improve?', placeholder: 'What should you do differently next time?' },
  { name: 'topicsToPrepare', label: 'Topics to prepare', placeholder: 'Example: React hooks, company research, BA fundamentals...' },
];

export function emptyInterviewForm() {
  return {
    company: '',
    role: '',
    date: '',
    round: '',
    result: 'Pending',
    rating: 5,
    wentWell: '',
    wentWrong: '',
    questionsICouldntAnswer: '',
    keyLearning: '',
    whatToImprove: '',
    topicsToPrepare: '',
    additionalNotes: '',
  };
}

export default function InterviewForm({ initialValues, onSubmit, submitLabel = 'Save Interview' }) {
  const [form, setForm] = useState(() => ({ ...emptyInterviewForm(), ...initialValues }));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.company.trim()) return setError('Please enter the company name.');
    if (!form.role.trim()) return setError('Please enter the role.');
    if (!form.date) return setError('Please select a date.');
    if (!form.round) return setError('Please select the interview round.');

    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && <Alert>{error}</Alert>}

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Interview Details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Company" htmlFor="company" required>
            <Input id="company" value={form.company} onChange={(e) => update('company', e.target.value)} placeholder="e.g. Silicon Signals" />
          </Field>
          <Field label="Role" htmlFor="role" required>
            <Input id="role" value={form.role} onChange={(e) => update('role', e.target.value)} placeholder="e.g. Full Stack Developer" />
          </Field>
          <Field label="Date" htmlFor="date" required>
            <Input id="date" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
          </Field>
          <Field label="Round" htmlFor="round" required>
            <Select id="round" value={form.round} onChange={(e) => update('round', e.target.value)}>
              <option value="" disabled>Select round</option>
              {ROUND_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Select>
          </Field>
          <Field label="Result" htmlFor="result" required>
            <Select id="result" value={form.result} onChange={(e) => update('result', e.target.value)}>
              {RESULT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </Select>
          </Field>
          <Field label="Overall Rating" htmlFor="rating" required>
            <RatingInput id="rating" value={form.rating} onChange={(v) => update('rating', v)} />
          </Field>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Reflection</h2>
        {REFLECTION_FIELDS.map(({ name, label, placeholder }) => (
          <Field key={name} label={label} htmlFor={name}>
            <Textarea id={name} value={form[name]} onChange={(e) => update(name, e.target.value)} placeholder={placeholder} />
          </Field>
        ))}
        <Field label="Additional notes" htmlFor="additionalNotes" hint="Optional">
          <Textarea id="additionalNotes" rows={3} value={form.additionalNotes} onChange={(e) => update('additionalNotes', e.target.value)} />
        </Field>
      </section>

      <div className="flex justify-end gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  );
}
