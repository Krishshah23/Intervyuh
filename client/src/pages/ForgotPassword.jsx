import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Field, Input } from '../components/Field';
import Alert from '../components/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">Reset your password</h2>
      <p className="mb-5 text-sm text-zinc-500 dark:text-zinc-400">
        Enter your email and we'll send you a reset link.
      </p>

      {sent ? (
        <Alert variant="success">
          If an account exists for that email, a reset link has been sent.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Email" htmlFor="email" required>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <Link to="/login" className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
          Back to log in
        </Link>
      </p>
    </div>
  );
}
