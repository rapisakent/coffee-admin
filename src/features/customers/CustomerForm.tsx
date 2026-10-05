import type { FormEvent } from 'react';
import type { Customer, CustomerType } from './data';
import { text } from '../../text';

interface Props {
  regions: string[];
  owners: string[];
  onSubmit: (values: Omit<Customer, 'id' | 'machines' | 'spend'>) => void;
  onCancel: () => void;
}

export function CustomerForm({ regions, owners, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSubmit({
      name: text(f, 'name'),
      type: text(f, 'type') as CustomerType,
      phone: text(f, 'phone'),
      email: text(f, 'email'),
      region: text(f, 'region'),
      owner: text(f, 'owner'),
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Tên khách hàng
        <input className="input" name="name" required maxLength={80} autoFocus />
      </label>
      <label className="field">
        Phân loại
        <select className="input" name="type" defaultValue="business">
          <option value="business">Doanh nghiệp</option>
          <option value="individual">Cá nhân</option>
        </select>
      </label>
      <label className="field">
        Số điện thoại
        <input className="input" name="phone" type="tel" required pattern="[0-9 +]{9,14}" title="9–14 chữ số" />
      </label>
      <label className="field span-2">
        Email
        <input className="input" name="email" type="email" />
      </label>
      <label className="field">
        Khu vực
        <input className="input" name="region" list="regions" required />
        <datalist id="regions">{regions.map((r) => <option key={r} value={r} />)}</datalist>
      </label>
      <label className="field">
        Người phụ trách
        <input className="input" name="owner" list="owners" required />
        <datalist id="owners">{owners.map((o) => <option key={o} value={o} />)}</datalist>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu khách hàng</button>
      </div>
    </form>
  );
}
