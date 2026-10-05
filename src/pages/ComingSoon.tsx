import { useLocation } from 'react-router';
import { findNav } from '../nav';

export default function ComingSoon() {
  const item = findNav(useLocation().pathname);
  const Icon = item?.icon;

  return (
    <main id="main" className="content">
      <div className="empty card">
        {Icon && <span className="kpi-icon"><Icon aria-hidden="true" /></span>}
        <h1>{item?.label ?? 'Không tìm thấy trang'}</h1>
        <p className="lead">{item ? 'Trang này đang được xây dựng.' : 'Đường dẫn không tồn tại.'}</p>
      </div>
    </main>
  );
}
