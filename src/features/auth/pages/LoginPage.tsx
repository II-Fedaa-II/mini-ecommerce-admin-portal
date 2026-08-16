import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiError } from '@/shared/api/httpClient';
import { Button } from '@/shared/components/ui/button';
import { FieldLabel, Input } from '@/shared/components/ui/input';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/products';

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(email, password);
      void navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6 py-16">
      <div className="w-full max-w-md border-2 border-ink bg-surface">
        <div className="border-b-2 border-ink bg-ink px-8 py-8">
          <p className="text-[11px] font-bold tracking-[0.14em] text-white/60 uppercase">Control panel</p>
          <h1 className="display mt-1 text-4xl text-white">Mini E-Commerce</h1>
          <p className="mt-2 text-sm text-white/70">Sign in with an account that has admin access.</p>
        </div>

        <form className="flex flex-col gap-5 px-8 py-8" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="border-2 border-danger bg-danger-soft px-3 py-2 text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="border-t-2 border-line px-8 py-5 text-xs text-ink-muted">
          Demo admin — <span className="text-ink-soft">admin@mini-ecommerce.test</span> /{' '}
          <span className="text-ink-soft">Admin123!</span>
        </p>
      </div>
    </main>
  );
}
