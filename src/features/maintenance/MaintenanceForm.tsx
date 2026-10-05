import type { FormEvent } from 'react';
import type { Customer } from '../customers/data';
import { isMachine, type Product } from '../products/data';
import { MAINTENANCE_STATUS, type Maintenance, type MaintenanceStatus } from './data';
import { text, today } from '../../text';

interface Props {
  customers: Customer[];
  products: Product[];
  technicians: string[];
  onSubmit: (values: Omit<Maintenance, 'id'>) => void;
  onCancel: () => void;
}


export function MaintenanceForm({ customers, products, technicians, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const customer = customers.find((c) => c.id === f.get('customer'));
    if (!customer) return;
    onSubmit({
      customerId: customer.id,
      customer: customer.name,
      device: text(f, 'device'),
      date: text(f, 'date'),
      tech: text(f, 'tech'),
      status: text(f, 'status') as MaintenanceStatus,
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
      <label className="field span-2">
        Thiết bị
        <select className="input" name="device" required defaultValue="">
          <option value="" disabled>Chọn máy…</option>
          {products.filter(isMachine).map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
        </select>
      </label>
      <label className="field">
        Ngày bảo trì
        <input className="input" name="date" type="date" required defaultValue={today()} />
      </label>
      <label className="field">
        Kỹ thuật viên
        <input className="input" name="tech" list="maint-techs" required />
        <datalist id="maint-techs">{technicians.map((t) => <option key={t} value={t} />)}</datalist>
      </label>
      <label className="field span-2">
        Trạng thái
        <select className="input" name="status" defaultValue="awaiting">
          {Object.entries(MAINTENANCE_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu lịch</button>
      </div>
    </form>
  );
}
