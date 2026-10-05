import { Download, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { EntityStatus } from '../stores/createEntityStore';
import { downloadCsv, fold } from '../text';
import { DataTable, type Column } from './DataTable';
import { FormFill } from './FormFill';
import { LoadState } from './LoadState';
import { Modal } from './Modal';
import { PageHeader } from './PageHeader';

interface Filter<T> {
  label: string; // accessible name, also the "all" option
  options: [value: string, label: string][];
  test: (item: T, value: string) => boolean;
}

interface Props<T> {
  eyebrow: string;
  title: string;
  lead: string;
  /** Receives the current items so the stat cards stay live. */
  stats: (items: T[]) => ReactNode;
  statsCols: 3 | 4;
  items: T[];
  /** Load state of `items` (from the entity store) and a retry. */
  status: EntityStatus;
  error: string | null;
  onReload: () => void;
  columns: Column<T>[];
  rowKey: (item: T) => string;
  searchText: (item: T) => string;
  searchPlaceholder: string;
  filter: Filter<T>;
  csv: { filename: string; header: string[]; row: (item: T) => (string | number)[] };
  noun: string; // "khách hàng" — used in button + messages
  /** Overrides the default "Thêm {noun}" button and dialog title. */
  createLabel?: string;
  /** Render the form; call `done` after saving or cancelling. `editing` is set when a row is being edited. */
  renderForm?: (done: () => void, editing?: T) => ReactNode;
  /** Show an edit button per row (needs renderForm; the form's field names must match the item's keys). */
  canEdit?: boolean;
  /** Show a delete button per row; called after the user confirms. */
  onRemove?: (item: T) => void;
  /** Use instead of renderForm when creation happens on another page. */
  primary?: { label: string; to: string };
}

export function EntityListPage<T>(p: Props<T>) {
  const [query, setQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [removing, setRemoving] = useState<T | null>(null);

  const canEdit = Boolean(p.canEdit && p.renderForm);
  const columns: Column<T>[] =
  canEdit || p.onRemove
    ? [
        ...p.columns,
        {
          key: 'actions',
          header: 'Thao tác',
          align: 'right',
          cell: (item) => (
            <div className="row-actions">
              {canEdit && (
                <button className="icon-btn" onClick={() => setEditing(item)} aria-label={`Sửa ${p.rowKey(item)}`}>
                  <Pencil aria-hidden="true" />
                </button>
              )}
              {p.onRemove && (
                <button className="icon-btn" onClick={() => setRemoving(item)} aria-label={`Xóa ${p.rowKey(item)}`}>
                  <Trash2 aria-hidden="true" />
                </button>
              )}
            </div>
          ),
        },
      ]
    : p.columns;

  const q = fold(query.trim());
  const rows = p.items.filter(
    (item) => (filterValue === 'all' || p.filter.test(item, filterValue)) && (!q || fold(p.searchText(item)).includes(q)),
  );

  return (
    <main id="main" className="content">
      <PageHeader
        eyebrow={p.eyebrow}
        title={p.title}
        lead={p.lead}
        actions={
          <>
            <button
              className="btn"
              disabled={rows.length === 0}
              onClick={() => downloadCsv(p.csv.filename, p.csv.header, rows.map(p.csv.row))}
            >
              <Download aria-hidden="true" /> Xuất CSV
            </button>
            {p.primary ? (
              <Link className="btn btn-primary" to={p.primary.to}>
                <Plus aria-hidden="true" /> {p.primary.label}
              </Link>
            ) : (
              p.renderForm && (
                <button className="btn btn-primary" onClick={() => setCreating(true)}>
                  <Plus aria-hidden="true" /> {p.createLabel ?? `Thêm ${p.noun}`}
                </button>
              )
            )}
          </>
        }
      />

      {p.status !== 'ready' ? (
        <LoadState status={p.status} error={p.error} onReload={p.onReload} />
      ) : (
        <>
      {p.error && (
        <p className="form-error" role="alert">
          {p.error} <button className="link" onClick={p.onReload}>Tải lại</button>
        </p>
      )}

      <section className={`stats stats-${p.statsCols}`} aria-label={`Thống kê ${p.noun}`}>
        {p.stats(p.items)}
      </section>

      <section className="card table-card">
        <div className="toolbar">
          <label className="search">
            <Search aria-hidden="true" />
            <input
              className="input"
              type="search"
              placeholder={p.searchPlaceholder}
              aria-label={`Tìm ${p.noun}`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            className="input select"
            aria-label={p.filter.label}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          >
            <option value="all">{p.filter.label}</option>
            {p.filter.options.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <span className="toolbar-count" aria-live="polite">{rows.length} bản ghi</span>
        </div>

        <DataTable
          caption={`Danh sách ${p.noun}`}
          columns={columns}
          rows={rows}
          rowKey={p.rowKey}
          empty={`Không tìm thấy ${p.noun} phù hợp.`}
        />

        <footer className="table-foot">
          <span>Hiển thị {rows.length} / {p.items.length}</span>
        </footer>
      </section>
        </>
      )}

      {p.renderForm && (
        <Modal open={creating} title={p.createLabel ?? `Thêm ${p.noun}`} onClose={() => setCreating(false)}>
          {p.renderForm(() => setCreating(false))}
        </Modal>
      )}
      {canEdit && (
        <Modal open={editing !== null} title={`Sửa ${p.noun}${editing ? ` ${p.rowKey(editing)}` : ''}`} onClose={() => setEditing(null)}>
          {editing && <FormFill values={editing}>{p.renderForm!(() => setEditing(null), editing)}</FormFill>}
        </Modal>
      )}
      {p.onRemove && (
        <Modal open={removing !== null} title={`Xóa ${p.noun}`} onClose={() => setRemoving(null)}>
          {removing && (
            <div className="confirm">
              <p>Xóa <strong>{p.rowKey(removing)}</strong>? Thao tác này không thể hoàn tác.</p>
              <div className="form-actions">
                <button className="btn" onClick={() => setRemoving(null)}>Hủy</button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    p.onRemove!(removing);
                    setRemoving(null);
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </main>
  );
}
