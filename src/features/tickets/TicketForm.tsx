import type { FormEvent } from 'react';
import type { Customer } from '../customers/data';
import { PRIORITY_LABEL, TICKET_STATUS, type Priority, type Ticket, type TicketStatus } from './data';
import { text, today } from '../../text';

interface Props {
  customers: Customer[];
  owners: string[];
  onSubmit: (values: Omit<Ticket, 'id'>) => void;
  onCancel: () => void;
}


export function TicketForm({ customers, owners, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const customer = customers.find((c) => c.id === f.get('customer'));
    if (!customer) return;
    onSubmit({
      title: text(f, 'title'),
      customerId: customer.id,
      customer: customer.name,
      priority: text(f, 'priority') as Priority,
      owner: text(f, 'owner'),
      date: text(f, 'date'),
      status: text(f, 'status') as TicketStatus,
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Vấn đề
        <input className="input" name="title" required autoFocus />
      </label>
      <label className="field span-2">
        Khách hàng
        <select className="input" name="customer" required defaultValue="">
          <option value="" disabled>Chọn khách hàng…</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
        </select>
      </label>
      <label className="field">
        Mức ưu tiên
        <select className="input" name="priority" defaultValue="normal">
          {Object.entries(PRIORITY_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="field">
        Trạng thái
        <select className="input" name="status" defaultValue="new">
          {Object.entries(TICKET_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="field">
        Người phụ trách
        <input className="input" name="owner" list="ticket-owners" required />
        <datalist id="ticket-owners">{owners.map((o) => <option key={o} value={o} />)}</datalist>
      </label>
      <label className="field">
        Ngày tạo
        <input className="input" name="date" type="date" required defaultValue={today()} />
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu ticket</button>
      </div>
    </form>
  );
}
