import { useState, type FormEvent } from 'react';
import type { Product } from '../products/data';
import { STOCKTAKE_STATUS, type Stocktake, type StocktakeStatus } from './data';
import { num, text, today } from '../../text';

interface Props {
  products: Product[];
  owners: string[];
  onSubmit: (values: Omit<Stocktake, 'id'>) => void;
  onCancel: () => void;
}


export function StocktakeForm({ products, owners, onSubmit, onCancel }: Props) {
  const [productId, setProductId] = useState('');
  const product = products.find((p) => p.id === productId);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!product) return;
    const f = new FormData(e.currentTarget);
    onSubmit({
      productId: product.id,
      product: product.name,
      status: text(f, 'status') as StocktakeStatus,
      book: product.stock,
      counted: num(f, 'counted'),
      date: text(f, 'date'),
      owner: text(f, 'owner'),
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Sản phẩm
        <select className="input" name="product" required value={productId} onChange={(e) => setProductId(e.target.value)} autoFocus>
          <option value="" disabled>Chọn sản phẩm…</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label className="field">
        Tồn sổ sách
        <input className="input" readOnly value={product ? `${product.stock} ${product.unit}` : ''} placeholder="Theo sản phẩm" />
      </label>
      <label className="field">
        Thực đếm
        <input className="input" name="counted" type="number" min="0" step="1" required />
      </label>
      <label className="field">
        Ngày kiểm
        <input className="input" name="date" type="date" required defaultValue={today()} />
      </label>
      <label className="field">
        Người phụ trách
        <input className="input" name="owner" list="stocktake-owners" required />
        <datalist id="stocktake-owners">{owners.map((o) => <option key={o} value={o} />)}</datalist>
      </label>
      <label className="field span-2">
        Trạng thái
        <select className="input" name="status" defaultValue="pending">
          {Object.entries(STOCKTAKE_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu phiếu</button>
      </div>
    </form>
  );
}
