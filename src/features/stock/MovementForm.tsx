import { useState, type FormEvent } from 'react';
import type { Product } from '../products/data';
import { MOVEMENT_LABEL, type MovementType, type StockMovement } from './data';
import { num, text } from '../../text';

interface Props {
  products: Product[];
  /** Returns an error message to show, or null when the movement was recorded. */
  onSubmit: (values: Omit<StockMovement, 'id' | 'at'>) => string | null;
  onCancel: () => void;
}

export function MovementForm({ products, onSubmit, onCancel }: Props) {
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const product = products.find((p) => p.id === f.get('product'));
    if (!product) return;
    setError(
      onSubmit({
        productId: product.id,
        product: product.name,
        type: text(f, 'type') as MovementType,
        qty: num(f, 'qty'),
        note: String(f.get('note') ?? '').trim(),
      }),
    );
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Sản phẩm
        <select className="input" name="product" required defaultValue="" autoFocus onChange={() => setError(null)}>
          <option value="" disabled>Chọn sản phẩm…</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name} — tồn {p.stock} {p.unit}</option>)}
        </select>
      </label>
      <label className="field">
        Loại phiếu
        <select className="input" name="type" defaultValue="in">
          {Object.entries(MOVEMENT_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="field">
        Số lượng
        <input className="input" name="qty" type="number" min="1" step="1" required onChange={() => setError(null)} />
      </label>
      <label className="field span-2">
        Ghi chú
        <input className="input" name="note" maxLength={120} placeholder="Nhập từ NCC, xuất cho đơn DH-…" />
      </label>
      {error && <p className="form-error span-2" role="alert">{error}</p>}
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu phiếu</button>
      </div>
    </form>
  );
}
