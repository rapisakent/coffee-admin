import type { FormEvent } from 'react';
import { PAYMENT_METHODS, TRANSACTION_TYPE, type Transaction, type TransactionType } from './data';
import { num, text, today } from '../../text';

interface Props {
  onSubmit: (values: Omit<Transaction, 'id'>) => void;
  onCancel: () => void;
}


export function TransactionForm({ onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSubmit({
      title: text(f, 'title'),
      type: text(f, 'type') as TransactionType,
      amount: num(f, 'amount'),
      method: text(f, 'method'),
      date: text(f, 'date'),
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Nội dung
        <input className="input" name="title" required autoFocus />
      </label>
      <label className="field">
        Loại phiếu
        <select className="input" name="type" defaultValue="in">
          {Object.entries(TRANSACTION_TYPE).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="field">
        Số tiền (triệu đồng)
        <input className="input" name="amount" type="number" min="0" step="any" required />
      </label>
      <label className="field">
        Phương thức
        <select className="input" name="method" defaultValue={PAYMENT_METHODS[0]}>
          {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
        </select>
      </label>
      <label className="field">
        Ngày
        <input className="input" name="date" type="date" required defaultValue={today()} />
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu phiếu</button>
      </div>
    </form>
  );
}
