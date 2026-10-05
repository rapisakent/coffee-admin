import { useState, type FormEvent } from 'react';
import type { Order } from '../orders/data';
import { INVOICE_STATUS, type Invoice, type InvoiceStatus } from './data';
import { text, today } from '../../text';

interface Props {
  orders: Order[];
  /** Orders that already have an invoice are not offered again. */
  invoicedOrderIds: string[];
  onSubmit: (values: Omit<Invoice, 'id'>) => void;
  onCancel: () => void;
}


export function InvoiceForm({ orders, invoicedOrderIds, onSubmit, onCancel }: Props) {
  const [orderId, setOrderId] = useState('');
  const order = orders.find((o) => o.id === orderId);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!order) return;
    const f = new FormData(e.currentTarget);
    onSubmit({
      orderId: order.id,
      customerId: order.customerId,
      customer: order.customer,
      amount: order.total,
      date: text(f, 'date'),
      status: text(f, 'status') as InvoiceStatus,
    });
  };

  return (
    <form className="form" onSubmit={submit}>
      <label className="field span-2">
        Đơn hàng
        <select className="input" name="order" required value={orderId} onChange={(e) => setOrderId(e.target.value)} autoFocus>
          <option value="" disabled>Chọn đơn hàng…</option>
          {orders
            .filter((o) => !invoicedOrderIds.includes(o.id))
            .map((o) => <option key={o.id} value={o.id}>{o.id} — {o.customer}</option>)}
        </select>
      </label>
      <label className="field">
        Khách hàng
        <input className="input" readOnly value={order?.customer ?? ''} placeholder="Theo đơn hàng" />
      </label>
      <label className="field">
        Tổng tiền (triệu đồng)
        <input className="input" readOnly value={order?.total ?? ''} placeholder="Theo đơn hàng" />
      </label>
      <label className="field">
        Ngày
        <input className="input" name="date" type="date" required defaultValue={today()} />
      </label>
      <label className="field">
        Trạng thái
        <select className="input" name="status" defaultValue="unpaid">
          {Object.entries(INVOICE_STATUS).map(([value, [label]]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </label>
      <div className="form-actions span-2">
        <button type="button" className="btn" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">Lưu chứng từ</button>
      </div>
    </form>
  );
}
