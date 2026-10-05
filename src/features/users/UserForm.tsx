import type { FormEvent } from 'react';
import { ROLES, type AppUser } from './data';
import { text } from '../../text';

interface Props {
  emails: string[];
  onSubmit: (values: Omit<AppUser, 'id'>) => void;
  onCancel: () => void;
}

export function UserForm({ emails, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSubmit({
      name: text(f, 'name'),
      email: text(f, 'email'),
      role: text(f, 'role'),
      active: true,
    });
  };

  const checkEmail = (input: HTMLInputElement) => {
    const taken = emails.some((m) => m.toLowerCase() === input.value.trim().toLowerCase());
    input.setCustomValidity(taken ? 'Email này đã được dùng.' : '');
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Họ tên
        <input className="input" name="name" required autoFocus />
      </label>
      <label className="field">
        Email
        <input className="input" name="email" type="email" required onInput={(e) => checkEmail(e.currentTarget)} />
      </label>
      <label className="field">
        Vai trò
        <select className="input" name="role" defaultValue={ROLES[1]}>
          {ROLES.map((r) => <option key={r}>{r}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu người dùng</button>
      </div>
    </form>
  );
}
