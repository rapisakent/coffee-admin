import type { FormEvent } from 'react';
import { CATEGORY_STATUS, type Category, type CategoryStatus } from './data';
import { text } from '../../text';

interface Props {
  names: string[];
  onSubmit: (values: Omit<Category, 'id'>) => void;
  onCancel: () => void;
}

export function CategoryForm({ names, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSubmit({
      name: text(f, 'name'),
      status: text(f, 'status') as CategoryStatus,
    });
  };

  const checkDuplicate = (input: HTMLInputElement) => {
    const taken = names.some((n) => n.toLowerCase() === input.value.trim().toLowerCase());
    input.setCustomValidity(taken ? 'Danh mục này đã tồn tại.' : '');
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Tên danh mục
        <input className="input" name="name" required autoFocus onInput={(e) => checkDuplicate(e.currentTarget)} />
      </label>
      <label className="field span-2">
        Trạng thái
        <select className="input" name="status" defaultValue="active">
          {Object.entries(CATEGORY_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu danh mục</button>
      </div>
    </form>
  );
}
