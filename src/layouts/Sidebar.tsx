import { Coffee } from 'lucide-react';
import { Link, NavLink } from 'react-router';
import { NAV } from '../nav';

export function Sidebar({ open }: { open: boolean }) {
  return (
    <aside id="sidebar" className={`sidebar ${open ? 'open' : ''}`} aria-label="Điều hướng chính">
      <Link className="brand" to="/">
        <span className="brand-logo"><Coffee aria-hidden="true" /></span>
        <span>
          <strong>Coffee Admin</strong>
          <small>CRM &amp; ERP</small>
        </span>
      </Link>
      <nav>
        {NAV.map((group) => (
          <div className="nav-group" key={group.label}>
            <p className="nav-label">{group.label}</p>
            {group.items.map(({ path, label, icon: Icon }) => (
              <NavLink key={path} className="nav-link" to={path} end>
                <Icon aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
