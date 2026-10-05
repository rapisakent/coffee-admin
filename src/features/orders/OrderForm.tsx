import type { FormEvent } from 'react';
import type { Customer } from '../customers/data';
import { ORDER_STATUS, type Order, type OrderStatus } from './data';
import { num, text, today } from '../../text';

interface Props {
  customers: Customer[];
  onSubmit: (values: Omit<Order, 'id'>) => void;
  onCancel: () => void;
}


export function OrderForm({ customers, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const customer = customers.find((c) => c.id === f.get('customer'));
    if (!customer) return;
    onSubmit({
      customerId: customer.id,
      customer: customer.name,
      date: text(f, 'date'),
      total: num(f, 'total'),
      status: text(f, 'status') as OrderStatus,
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Khách hàng
        <select className="input" name="customer" required defaultValue="" autoFocus>
          <option value="" disabled>Chọn khách hàng…</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
        </select>
      </label>
      <label className="field">
        Ngày tạo
        <input className="input" name="date" type="date" required defaultValue={today()} />
      </label>
      <label className="field">
        Tổng tiền (triệu đồng)
        <input className="input" name="total" type="number" min="0" step="any" required />
      </label>
      <label className="field span-2">
        Trạng thái
        <select className="input" name="status" defaultValue="pending">
          {Object.entries(ORDER_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu đơn hàng</button>
      </div>
    </form>
  );
}
