import { type SyntheticEvent, useState } from 'react';
import { API_URL } from '@/shared/api/httpClient';
import { cn } from '@/shared/lib/utils';

/** Uploaded images come back as `/uploads/xxx`, relative to the API origin, not this app's. */
export function resolveImageUrl(src: string | null | undefined): string | null {
  if (!src) return null;
  return /^https?:\/\//.test(src) ? src : `${API_URL}${src}`;
}

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  letterClassName?: string;
}

/** Falls back to a monogram tile if there's no image, or the URL fails to load. */
export function ProductImage({ src, alt, className, letterClassName }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveImageUrl(src);

  function handleError(event: SyntheticEvent<HTMLImageElement>) {
    event.currentTarget.onerror = null;
    setFailed(true);
  }

  if (!resolved || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-paper">
        <span className={letterClassName ?? cn('display text-4xl text-line')}>
          {alt.slice(0, 1).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img src={resolved} alt={alt} loading="lazy" className={className} onError={handleError} />
  );
}
