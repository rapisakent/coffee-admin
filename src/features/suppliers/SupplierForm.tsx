import type { FormEvent } from 'react';
import type { Category } from '../categories/data';
import { PAYMENT_TERMS, type Supplier } from './data';
import { text } from '../../text';

interface Props {
  categories: Category[];
  regions: string[];
  onSubmit: (values: Omit<Supplier, 'id'>) => void;
  onCancel: () => void;
}

export function SupplierForm({ categories, regions, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSubmit({
      name: text(f, 'name'),
      category: text(f, 'category'),
      phone: text(f, 'phone'),
      email: text(f, 'email'),
      region: text(f, 'region'),
      terms: text(f, 'terms'),
      active: true,
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Tên nhà cung cấp
        <input className="input" name="name" required autoFocus />
      </label>
      <label className="field span-2">
        Nhóm hàng cung cấp
        <select className="input" name="category" required defaultValue="">
          <option value="" disabled>Chọn danh mục…</option>
          {categories.map((c) => <option key={c.id}>{c.name}</option>)}
        </select>
      </label>
      <label className="field">
        Số điện thoại
        <input className="input" name="phone" type="tel" required />
      </label>
      <label className="field">
        Email
        <input className="input" name="email" type="email" />
      </label>
      <label className="field">
        Khu vực
        <input className="input" name="region" list="supplier-regions" required />
        <datalist id="supplier-regions">{regions.map((r) => <option key={r} value={r} />)}</datalist>
      </label>
      <label className="field">
        Điều khoản thanh toán
        <select className="input" name="terms" defaultValue={PAYMENT_TERMS[2]}>
          {PAYMENT_TERMS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu nhà cung cấp</button>
      </div>
    </form>
  );
}
