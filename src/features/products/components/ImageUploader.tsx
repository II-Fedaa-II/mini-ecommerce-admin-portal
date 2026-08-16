import { ImagePlus, Loader2, X } from 'lucide-react';
import { useRef, useState, type DragEvent } from 'react';
import { ProductImage } from '@/shared/components/ui/ProductImage';
import { errorMessage } from '@/shared/lib/errorMessage';
import { cn } from '@/shared/lib/utils';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
const MAX_BYTES = 5 * 1024 * 1024;

interface ImageUploaderProps {
  value: string | null;
  alt: string;
  isUploading: boolean;
  onUpload: (file: File) => Promise<{ imageUrl: string }>;
  onChange: (imageUrl: string | null) => void;
}

/** Drag-and-drop or click-to-browse, uploading immediately so the form always holds a real URL. */
export function ImageUploader({ value, alt, isUploading, onUpload, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Use PNG, JPEG, WebP, or AVIF.';
    }
    if (file.size > MAX_BYTES) {
      return 'Image must be 5MB or smaller.';
    }
    return null;
  }

  async function handleFile(file: File) {
    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    try {
      const result = await onUpload(file);
      onChange(result.imageUrl);
    } catch (err) {
      setError(errorMessage(err, 'Could not upload that image.'));
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) void handleFile(file);
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload product image"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative flex aspect-video w-full cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed transition-colors',
          isDragging ? 'border-accent bg-accent/10' : 'border-line bg-paper hover:border-ink-muted',
        )}
      >
        <input
          id="image"
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = '';
          }}
        />

        {value ? (
          <ProductImage src={value} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center text-ink-soft">
            <ImagePlus className="h-6 w-6" aria-hidden strokeWidth={2} />
            <p className="text-[11px] font-bold tracking-[0.1em] uppercase">
              Drop an image, or click to browse
            </p>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/60">
            <Loader2 className="h-6 w-6 animate-spin text-white" aria-hidden />
          </div>
        )}

        {value && !isUploading && (
          <button
            type="button"
            aria-label="Remove image"
            onClick={(e) => {
              e.stopPropagation();
              onChange(null);
            }}
            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center border-2 border-ink bg-surface text-ink transition-colors hover:bg-danger hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden strokeWidth={2.5} />
          </button>
        )}
      </div>

      {error && (
        <p className="text-[11px] font-bold tracking-[0.06em] text-danger uppercase" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
