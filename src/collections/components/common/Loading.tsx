import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed top-0 left-0 z-999 flex h-full w-full items-center justify-center bg-white/20">
      <span style={{ animation: 'spin 1s linear infinite', transformOrigin: 'center center' }}>
        <LoaderCircle className="h-10 w-10 animate-spin text-black/60 dark:text-white/60" />
      </span>
    </div>
  );
}
