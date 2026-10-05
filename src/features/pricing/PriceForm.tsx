import type { FormEvent } from 'react';
import type { Product } from '../products/data';
import { SEGMENT, type PriceEntry, type Segment } from './data';
import { num, text, today } from '../../text';

interface Props {
  products: Product[];
  onSubmit: (values: Omit<PriceEntry, 'id'>) => void;
  onCancel: () => void;
}


export function PriceForm({ products, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const product = products.find((p) => p.id === f.get('product'));
    if (!product) return;
    onSubmit({
      productId: product.id,
      product: product.name,
      segment: text(f, 'segment') as Segment,
      price: num(f, 'price'),
      from: text(f, 'from'),
      to: text(f, 'to'),
    });
  };

  const checkRange = (form: HTMLFormElement) => {
    const from = form.elements.namedItem('from') as HTMLInputElement;
    const to = form.elements.namedItem('to') as HTMLInputElement;
    to.setCustomValidity(to.value && from.value && to.value < from.value ? 'Ngày kết thúc phải sau ngày bắt đầu.' : '');
  };

  return (
    <form className="form" onSubmit={submit} onChange={(e) => checkRange(e.currentTarget)}>
      <label className="field span-2">
        Sản phẩm
        <select className="input" name="product" required defaultValue="" autoFocus>
          <option value="" disabled>Chọn sản phẩm…</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label className="field">
        Nhóm khách
        <select className="input" name="segment" defaultValue="retail">
          {Object.entries(SEGMENT).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="field">
        Giá bán (triệu đồng)
        <input className="input" name="price" type="number" min="0" step="any" required />
      </label>
      <label className="field">
        Áp dụng từ
        <input className="input" name="from" type="date" required defaultValue={today()} />
      </label>
      <label className="field">
        Đến ngày
        <input className="input" name="to" type="date" required />
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu mức giá</button>
      </div>
    </form>
  );
}
