import { cn } from '@/shared/lib/utils';

interface PermissionPickerProps {
  available: string[];
  selected: string[];
  disabled?: boolean;
  onChange: (permissions: string[]) => void;
}

export function PermissionPicker({ available, selected, disabled, onChange }: PermissionPickerProps) {
  function toggle(permission: string) {
    onChange(
      selected.includes(permission)
        ? selected.filter((entry) => entry !== permission)
        : [...selected, permission],
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {available.map((permission) => {
        const isActive = selected.includes(permission);
        return (
          <button
            key={permission}
            type="button"
            disabled={disabled}
            aria-pressed={isActive}
            onClick={() => toggle(permission)}
            className={cn(
              'border-2 px-3 py-1.5 font-mono text-xs transition-colors',
              isActive
                ? 'border-ink bg-accent text-white'
                : 'border-line bg-surface text-ink-soft hover:border-ink-muted hover:text-ink',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {permission}
          </button>
        );
      })}
    </div>
  );
}
