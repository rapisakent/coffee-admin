import type { FormEvent } from 'react';
import { DEBT_KIND, type Debt, type DebtKind } from './data';
import { inDays, num, text } from '../../text';

interface Props {
  parties: string[];
  onSubmit: (values: Omit<Debt, 'id'>) => void;
  onCancel: () => void;
}


export function DebtForm({ parties, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    onSubmit({
      party: text(f, 'party'),
      kind: text(f, 'kind') as DebtKind,
      total: num(f, 'total'),
      paid: num(f, 'paid'),
      due: text(f, 'due'),
    });
  };

  const checkPaid = (form: HTMLFormElement) => {
    const total = form.elements.namedItem('total') as HTMLInputElement;
    const paid = form.elements.namedItem('paid') as HTMLInputElement;
    paid.setCustomValidity(Number(paid.value) > Number(total.value) ? 'Số đã thanh toán không được vượt tổng tiền.' : '');
  };

  return (
    <form className="form" onSubmit={submit} onChange={(e) => checkPaid(e.currentTarget)}>
      <label className="field span-2">
        Đối tác (khách hàng / nhà cung cấp)
        <input className="input" name="party" list="debt-parties" required autoFocus />
        <datalist id="debt-parties">{parties.map((p) => <option key={p} value={p} />)}</datalist>
      </label>
      <label className="field">
        Loại công nợ
        <select className="input" name="kind" defaultValue="receivable">
          {Object.entries(DEBT_KIND).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="field">
        Hạn thanh toán
        <input className="input" name="due" type="date" required defaultValue={inDays(14)} />
      </label>
      <label className="field">
        Tổng tiền (triệu đồng)
        <input className="input" name="total" type="number" min="0" step="any" required />
      </label>
      <label className="field">
        Đã thanh toán (triệu đồng)
        <input className="input" name="paid" type="number" min="0" step="any" required defaultValue="0" />
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu công nợ</button>
      </div>
    </form>
  );
}
