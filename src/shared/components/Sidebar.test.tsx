import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { renderWithProviders } from '@/shared/test/renderWithProviders';
import { Sidebar } from './Sidebar';

/**
 * Signing in through the real login form is what populates the auth context, so these
 * tests exercise the same path the operator takes rather than stubbing the context.
 */
async function signInAs(email: string) {
  const user = userEvent.setup();
  renderWithProviders(
    <>
      <LoginPage />
      <Sidebar />
    </>,
  );

  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Password'), 'Admin123!');
  await user.click(screen.getByRole('button', { name: 'Sign in' }));
}

describe('Sidebar', () => {
  it('shows every section to an admin', async () => {
    await signInAs('admin@mini-ecommerce.test');

    await waitFor(() => expect(screen.getByRole('link', { name: /Products/ })).toBeInTheDocument());
    expect(screen.getByRole('link', { name: /Roles/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Users/ })).toBeInTheDocument();
  });

  it('hides sections a limited role cannot reach', async () => {
    await signInAs('editor@mini-ecommerce.test');

    await waitFor(() => expect(screen.getByRole('link', { name: /Products/ })).toBeInTheDocument());
    // The catalogue editor holds only product permissions.
    expect(screen.queryByRole('link', { name: /Roles/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Users/ })).not.toBeInTheDocument();
  });
});
