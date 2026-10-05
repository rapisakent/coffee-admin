import type { FormEvent } from 'react';
import type { Serial } from '../serials/data';
import { WARRANTY_STATUS, type WarrantyStatus, type WarrantyTicket } from './data';
import { text } from '../../text';

interface Props {
  serials: Serial[];
  owners: string[];
  onSubmit: (values: Omit<WarrantyTicket, 'id'>) => void;
  onCancel: () => void;
}

export function WarrantyForm({ serials, owners, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const serial = serials.find((s) => s.id === f.get('serial'));
    if (!serial) return;
    onSubmit({
      serial: serial.id,
      customerId: serial.customerId,
      customer: serial.customer,
      device: serial.product,
      status: text(f, 'status') as WarrantyStatus,
      owner: text(f, 'owner'),
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Máy (theo serial)
        <select className="input" name="serial" required defaultValue="" autoFocus>
          <option value="" disabled>Chọn serial…</option>
          {serials.map((s) => <option key={s.id} value={s.id}>{s.id} — {s.customer}</option>)}
        </select>
      </label>
      <label className="field">
        Trạng thái
        <select className="input" name="status" defaultValue="inspecting">
          {Object.entries(WARRANTY_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="field">
        Phụ trách
        <input className="input" name="owner" list="owners" required />
        <datalist id="owners">{owners.map((o) => <option key={o} value={o} />)}</datalist>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu yêu cầu</button>
      </div>
    </form>
  );
}
