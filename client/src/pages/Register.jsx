import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { Field, Input } from '../components/Field';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="mb-5 text-base font-semibold text-zinc-900 dark:text-zinc-100">Create an account</h2>
      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name" htmlFor="name" required>
          <Input
            id="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </Field>
        <Field label="Password" htmlFor="password" required hint="At least 6 characters">
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </Field>
        <Field label="Confirm password" htmlFor="confirmPassword" required>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            required
          />
        </Field>
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Create account
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
          Log in
        </Link>
      </p>
    </div>
  );
}
