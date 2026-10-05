import type { FormEvent } from 'react';
import type { Customer } from '../customers/data';
import { QUOTE_STATUS, type Quote, type QuoteStatus } from './data';
import { inDays, num, text } from '../../text';

interface Props {
  customers: Customer[];
  onSubmit: (values: Omit<Quote, 'id'>) => void;
  onCancel: () => void;
}


export function QuoteForm({ customers, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const customer = customers.find((c) => c.id === f.get('customer'));
    if (!customer) return;
    onSubmit({
      name: text(f, 'name'),
      customerId: customer.id,
      customer: customer.name,
      amount: num(f, 'amount'),
      validUntil: text(f, 'validUntil'),
      status: text(f, 'status') as QuoteStatus,
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Tên báo giá
        <input className="input" name="name" required autoFocus />
      </label>
      <label className="field span-2">
        Khách hàng
        <select className="input" name="customer" required defaultValue="">
          <option value="" disabled>Chọn khách hàng…</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
        </select>
      </label>
      <label className="field">
        Tổng tiền (triệu đồng)
        <input className="input" name="amount" type="number" min="0" step="any" required />
      </label>
      <label className="field">
        Hiệu lực đến
        <input className="input" name="validUntil" type="date" required defaultValue={inDays(14)} />
      </label>
      <label className="field span-2">
        Trạng thái
        <select className="input" name="status" defaultValue="draft">
          {Object.entries(QUOTE_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu báo giá</button>
      </div>
    </form>
  );
}
