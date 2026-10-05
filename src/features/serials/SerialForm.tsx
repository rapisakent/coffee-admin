import type { FormEvent } from 'react';
import type { Customer } from '../customers/data';
import { isMachine, type Product } from '../products/data';
import { SERIAL_STATUS, type Serial, type SerialStatus } from './data';
import { text } from '../../text';

interface Props {
  products: Product[];
  customers: Customer[];
  existingIds: string[];
  onSubmit: (serial: Serial) => void;
  onCancel: () => void;
}

export function SerialForm({ products, customers, existingIds, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const id = text(f, 'id').toUpperCase();
    const product = products.find((p) => p.id === f.get('product'));
    const customer = customers.find((c) => c.id === f.get('customer'));
    if (!product || !customer) return;

    const field = form.elements.namedItem('id') as HTMLInputElement;
    if (existingIds.includes(id)) {
      field.setCustomValidity('Serial đã tồn tại');
      field.reportValidity();
      return;
    }
    onSubmit({
      id,
      productId: product.id,
      product: product.name,
      customerId: customer.id,
      customer: customer.name,
      status: text(f, 'status') as SerialStatus,
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Số serial
        <input className="input" name="id" required maxLength={40} pattern="[A-Za-z0-9\-]+" title="Chữ, số và dấu gạch ngang" autoFocus onInput={(e) => e.currentTarget.setCustomValidity('')} />
      </label>
      <label className="field span-2">
        Sản phẩm (máy)
        <select className="input" name="product" required defaultValue="">
          <option value="" disabled>Chọn máy…</option>
          {products.filter(isMachine).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>
      <label className="field span-2">
        Khách hàng
        <select className="input" name="customer" required defaultValue="">
          <option value="" disabled>Chọn khách hàng…</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name} ({c.id})</option>)}
        </select>
      </label>
      <label className="field span-2">
        Trạng thái
        <select className="input" name="status" defaultValue="awaitingInstall">
          {Object.entries(SERIAL_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu serial</button>
      </div>
    </form>
  );
}
