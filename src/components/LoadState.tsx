import { LoaderCircle, TriangleAlert } from 'lucide-react';

interface Props {
  status: 'idle' | 'loading' | 'ready' | 'error';
  error?: string | null;
  onReload: () => void;
}

/** Placeholder for a page whose data has not arrived: spinner while loading, message + retry on failure. */
export function LoadState({ status, error, onReload }: Props) {
  if (status === 'error') {
    return (
      <section className="card load-state" role="alert">
        <TriangleAlert aria-hidden="true" />
        <p>{error ?? 'Không tải được dữ liệu.'}</p>
        <button className="btn" onClick={onReload}>Thử lại</button>
      </section>
    );
  }
  return (
    <section className="card load-state" role="status" aria-live="polite">
      <LoaderCircle className="spin" aria-hidden="true" />
      <p>Đang tải dữ liệu…</p>
    </section>
  );
}
