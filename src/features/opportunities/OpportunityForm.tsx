import type { FormEvent } from 'react';
import type { Customer } from '../customers/data';
import { OPPORTUNITY_STATUS, type Opportunity, type OpportunityStatus } from './data';
import { num, text, today } from '../../text';

interface Props {
  customers: Customer[];
  owners: string[];
  onSubmit: (values: Omit<Opportunity, 'id'>) => void;
  onCancel: () => void;
}


export function OpportunityForm({ customers, owners, onSubmit, onCancel }: Props) {
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
      probability: num(f, 'probability'),
      owner: text(f, 'owner'),
      date: text(f, 'date'),
      status: text(f, 'status') as OpportunityStatus,
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Tên cơ hội
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
        Xác suất (%)
        <input className="input" name="probability" type="number" min="0" max="100" step="5" required defaultValue="50" />
      </label>
      <label className="field">
        Người phụ trách
        <input className="input" name="owner" list="opp-owners" required />
        <datalist id="opp-owners">{owners.map((o) => <option key={o} value={o} />)}</datalist>
      </label>
      <label className="field">
        Ngày dự kiến chốt
        <input className="input" name="date" type="date" required defaultValue={today()} />
      </label>
      <label className="field span-2">
        Trạng thái
        <select className="input" name="status" defaultValue="consulting">
          {Object.entries(OPPORTUNITY_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu cơ hội</button>
      </div>
    </form>
  );
}
