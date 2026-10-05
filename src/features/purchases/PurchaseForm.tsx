import type { FormEvent } from 'react';
import type { Supplier } from '../suppliers/data';
import { PURCHASE_STATUS, type Purchase, type PurchaseStatus } from './data';
import { inDays, num, text } from '../../text';

interface Props {
  suppliers: Supplier[];
  onSubmit: (values: Omit<Purchase, 'id'>) => void;
  onCancel: () => void;
}


export function PurchaseForm({ suppliers, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const supplier = suppliers.find((s) => s.id === f.get('supplier'));
    if (!supplier) return;
    onSubmit({
      name: text(f, 'name'),
      supplierId: supplier.id,
      supplier: supplier.name,
      amount: num(f, 'amount'),
      date: text(f, 'date'),
      status: text(f, 'status') as PurchaseStatus,
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Nội dung đơn mua
        <input className="input" name="name" required autoFocus />
      </label>
      <label className="field span-2">
        Nhà cung cấp
        <select className="input" name="supplier" required defaultValue="">
          <option value="" disabled>Chọn nhà cung cấp…</option>
          {suppliers.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
        </select>
      </label>
      <label className="field">
        Tổng tiền (triệu đồng)
        <input className="input" name="amount" type="number" min="0" step="any" required />
      </label>
      <label className="field">
        Ngày giao dự kiến
        <input className="input" name="date" type="date" required defaultValue={inDays(7)} />
      </label>
      <label className="field span-2">
        Trạng thái
        <select className="input" name="status" defaultValue="pending">
          {Object.entries(PURCHASE_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu đơn mua</button>
      </div>
    </form>
  );
}
