import type { FormEvent } from 'react';
import { LEAD_SOURCES, LEAD_STATUS, type Lead, type LeadStatus } from './data';
import { text, today } from '../../text';

interface Props {
  owners: string[];
  onSubmit: (values: Omit<Lead, 'id'>) => void;
  onCancel: () => void;
}


export function LeadForm({ owners, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSubmit({
      name: text(f, 'name'),
      phone: text(f, 'phone'),
      email: text(f, 'email'),
      source: text(f, 'source'),
      owner: text(f, 'owner'),
      date: text(f, 'date'),
      status: text(f, 'status') as LeadStatus,
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Tên khách hàng tiềm năng
        <input className="input" name="name" required autoFocus />
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
        Nguồn tiếp cận
        <select className="input" name="source" defaultValue={LEAD_SOURCES[0]}>
          {LEAD_SOURCES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label className="field">
        Người phụ trách
        <input className="input" name="owner" list="lead-owners" required />
        <datalist id="lead-owners">{owners.map((o) => <option key={o} value={o} />)}</datalist>
      </label>
      <label className="field">
        Ngày liên hệ
        <input className="input" name="date" type="date" required defaultValue={today()} />
      </label>
      <label className="field">
        Trạng thái
        <select className="input" name="status" defaultValue="new">
          {Object.entries(LEAD_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu</button>
      </div>
    </form>
  );
}
