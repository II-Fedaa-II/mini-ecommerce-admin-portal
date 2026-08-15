import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PermissionPicker } from './PermissionPicker';

const available = ['products:read', 'products:write', 'roles:manage'];

function Harness({ initial = [], onChange }: { initial?: string[]; onChange?: (next: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>(initial);
  return (
    <PermissionPicker
      available={available}
      selected={selected}
      onChange={(next) => {
        setSelected(next);
        onChange?.(next);
      }}
    />
  );
}

describe('PermissionPicker', () => {
  it('renders every available permission from the server catalogue', () => {
    render(<Harness />);
    available.forEach((permission) => {
      expect(screen.getByRole('button', { name: permission })).toBeInTheDocument();
    });
  });

  it('marks granted permissions as pressed', () => {
    render(<Harness initial={['products:write']} />);

    expect(screen.getByRole('button', { name: 'products:write' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'products:read' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('adds a permission when an ungranted one is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'products:write' }));

    expect(onChange).toHaveBeenLastCalledWith(['products:write']);
  });

  it('removes a permission when a granted one is clicked again', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness initial={['products:read', 'products:write']} onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'products:read' }));

    expect(onChange).toHaveBeenLastCalledWith(['products:write']);
  });

  it('cannot be edited when disabled, which is how built-in roles are locked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <PermissionPicker available={available} selected={['products:read']} disabled onChange={onChange} />,
    );

    await user.click(screen.getByRole('button', { name: 'products:write' }));

    expect(onChange).not.toHaveBeenCalled();
  });
});
