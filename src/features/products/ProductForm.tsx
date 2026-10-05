import type { FormEvent } from 'react';
import { GROUP_LABEL, type Product, type ProductGroup } from './data';
import { num, text } from '../../text';

interface Props {
  existingIds: string[];
  suppliers: string[];
  onSubmit: (product: Product) => void;
  onCancel: () => void;
}

export function ProductForm({ existingIds, suppliers, onSubmit, onCancel }: Props) {
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const id = text(f, 'id').toUpperCase();

    const sku = form.elements.namedItem('id') as HTMLInputElement;
    if (existingIds.includes(id)) {
      sku.setCustomValidity('Mã SKU đã tồn tại');
      sku.reportValidity();
      return;
    }
    onSubmit({
      id,
      name: text(f, 'name'),
      group: text(f, 'group') as ProductGroup,
      cost: num(f, 'cost'),
      price: num(f, 'price'),
      stock: num(f, 'stock'),
      unit: text(f, 'unit'),
      minStock: num(f, 'minStock'),
      supplier: text(f, 'supplier'),
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Tên sản phẩm
        <input className="input" name="name" required maxLength={100} autoFocus />
      </label>
      <label className="field">
        Mã SKU
        <input className="input" name="id" required maxLength={30} pattern="[A-Za-z0-9\-]+" title="Chữ, số và dấu gạch ngang" onInput={(e) => e.currentTarget.setCustomValidity('')} />
      </label>
      <label className="field">
        Nhóm
        <select className="input" name="group" defaultValue="espresso">
          {Object.entries(GROUP_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <label className="field">
        Giá vốn (triệu đồng)
        <input className="input" name="cost" type="number" min="0" step="any" required />
      </label>
      <label className="field">
        Giá bán (triệu đồng)
        <input className="input" name="price" type="number" min="0" step="any" required />
      </label>
      <label className="field">
        Tồn kho
        <input className="input" name="stock" type="number" min="0" step="1" defaultValue={0} required />
      </label>
      <label className="field">
        Đơn vị
        <input className="input" name="unit" required maxLength={10} placeholder="máy, kg, cái…" />
      </label>
      <label className="field">
        Tồn tối thiểu
        <input className="input" name="minStock" type="number" min="0" step="1" defaultValue={0} required />
      </label>
      <label className="field">
        Nhà cung cấp
        <input className="input" name="supplier" list="suppliers" required />
        <datalist id="suppliers">{suppliers.map((s) => <option key={s} value={s} />)}</datalist>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu sản phẩm</button>
      </div>
    </form>
  );
}
