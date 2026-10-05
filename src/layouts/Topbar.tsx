import { Bell, Menu, Moon, Package, ShoppingCart, Sun, Wrench } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { useTheme } from '../stores/theme';
import { AccountMenu } from './AccountMenu';

// ponytail: static mock until a notifications API exists
const NOTIFICATIONS = [
  { icon: Package, title: 'Tồn kho thấp: Máy xay Mahlkönig EK43 S', meta: '3 / 3 máy' },
  { icon: ShoppingCart, title: 'Đơn DH-2026-0032 chờ xác nhận', meta: 'Cộng Cà Phê - CN Quận 1' },
  { icon: Wrench, title: 'Lắp đặt tại Cộng Cà Phê - CN Quận 1', meta: '2026-09-30' },
];

export function Topbar({ title, navOpen, onMenu }: { title?: string; navOpen: boolean; onMenu: () => void }) {
  const { theme, toggle: toggleTheme } = useTheme();
  const [unread, setUnread] = useState(true);

  return (
    <header className="topbar">
      <button
        className="icon-btn menu-btn"
        aria-label={navOpen ? 'Đóng menu' : 'Mở menu'}
        aria-controls="sidebar"
        aria-expanded={navOpen}
        onClick={onMenu}
      >
        <Menu aria-hidden="true" />
      </button>

      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Coffee Admin</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{title ?? "Không tìm thấy"}</span>
      </nav>

      <div className="topbar-actions">
        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
        >
          {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>
        <button
          className={`icon-btn ${unread ? 'has-dot' : ''}`}
          popoverTarget="notif-panel"
          aria-label={unread ? `Thông báo, ${NOTIFICATIONS.length} chưa đọc` : 'Thông báo'}
        >
          <Bell aria-hidden="true" />
        </button>
        <AccountMenu />
      </div>

      <div id="notif-panel" className="popover" popover="auto">
        <div className="popover-head">
          <strong>Thông báo</strong>
          {unread && <button className="link" onClick={() => setUnread(false)}>Đánh dấu đã đọc</button>}
        </div>
        <ul className={`notif-list ${unread ? '' : 'read'}`}>
          {NOTIFICATIONS.map(({ icon: Icon, title, meta }) => (
            <li key={title}>
              <span className="notif-icon"><Icon aria-hidden="true" /></span>
              <div className="grow">
                <p>{title}</p>
                <small>{meta}</small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
