import { Download } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { api } from '../../api';
import { errorMessage } from '../../api/http';
import { useQuery } from '../../api/useQuery';
import { LoadState } from '../../components/LoadState';
import { PageHeader } from '../../components/PageHeader';
import { useTheme, type Mode } from '../../stores/theme';
import { CURRENCIES, type StoreSettings } from './data';
import { text } from '../../text';

const MODES: [Mode, string][] = [['light', 'Sáng'], ['dark', 'Tối'], ['system', 'Theo hệ thống']];

function download(filename: string, json: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}

export default function SettingsPage() {
  const { status, data, error, reload } = useQuery(api.settings.get);
  const { mode, setMode } = useTheme();
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (task: () => Promise<string>) => {
    setBusy(true);
    setNote(null);
    try {
      setNote({ ok: true, text: await task() });
    } catch (e) {
      setNote({ ok: false, text: errorMessage(e) });
    } finally {
      setBusy(false);
    }
  };

  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const values: StoreSettings = {
      name: text(f, 'name'),
      email: text(f, 'email'),
      phone: text(f, 'phone'),
      address: text(f, 'address'),
      currency: text(f, 'currency'),
    };
    void run(async () => {
      await api.settings.save(values);
      return 'Đã lưu cấu hình.';
    });
  };

  const backup = () =>
    void run(async () => {
      download(`coffee-admin-${new Date().toISOString().slice(0, 10)}.json`, await api.backup());
      return 'Đã tải bản sao dữ liệu.';
    });

  return (
    <main id="main" className="content">
      <PageHeader eyebrow="Hệ thống" title="Cấu hình" lead="Thông tin cửa hàng và tùy chọn hiển thị trên trình duyệt này." />

      {status !== 'ready' || !data ? (
        <LoadState status={status === 'error' ? 'error' : 'loading'} error={error} onReload={reload} />
      ) : (
        <div className="settings">
          <section className="card">
            <div className="card-head">
              <div>
                <h2>Thông tin cửa hàng</h2>
                <p>Thông tin này được lưu cùng dữ liệu của hệ thống.</p>
              </div>
            </div>
            <form className="form" onSubmit={save}>
              <label className="field">
                Tên cửa hàng
                <input className="input" name="name" defaultValue={data.name} required />
              </label>
              <label className="field">
                Email
                <input className="input" name="email" type="email" defaultValue={data.email} />
              </label>
              <label className="field">
                Số điện thoại
                <input className="input" name="phone" type="tel" defaultValue={data.phone} />
              </label>
              <label className="field">
                Địa chỉ
                <input className="input" name="address" defaultValue={data.address} />
              </label>
              <label className="field">
                Tiền tệ
                <select className="input select" name="currency" defaultValue={data.currency}>
                  {CURRENCIES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </label>
              <label className="field">
                Giao diện
                <select className="input select" value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                  {MODES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <div className="form-actions span-2">
                <button type="submit" className="btn btn-primary" disabled={busy}>Lưu thay đổi</button>
              </div>
            </form>
          </section>

          <section className="card">
            <div className="card-head">
              <div>
                <h2>Dữ liệu &amp; lưu trữ</h2>
                <p>Dữ liệu được lưu qua API. Tải bản sao JSON để giữ toàn bộ các bản ghi.</p>
              </div>
            </div>
            <div className="form-actions settings-backup">
              <button type="button" className="btn" onClick={backup} disabled={busy}>
                <Download size={16} aria-hidden /> Tải bản sao dữ liệu
              </button>
            </div>
          </section>

          {note && <p role="status" className={note.ok ? 'form-ok' : 'form-error'}>{note.text}</p>}
        </div>
      )}
    </main>
  );
}
