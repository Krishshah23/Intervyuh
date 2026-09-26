import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Alert from '../components/Alert';
import { Field, Input } from '../components/Field';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
      <h2 className="mb-5 text-base font-semibold text-zinc-900 dark:text-zinc-100">Log in</h2>
      {error && (
        <div className="mb-4">
          <Alert>{error}</Alert>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        <Field label="Password" htmlFor="password" required>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </Field>
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Log in
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
          Sign up
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-zinc-400">
        <Link to="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
      </p>
    </div>
  );
}
