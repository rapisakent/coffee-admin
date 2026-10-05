import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router';
import { ACCOUNT_ITEMS } from '../nav';
import { PALETTES, useTheme, type Mode } from '../stores/theme';

// ponytail: static mock until auth exists
const USER = { name: 'Quản trị viên', email: 'admin@coffeeviet.vn', initials: 'QT' };

const MODES: [Mode, string, LucideIcon][] = [
  ['light', 'Sáng', Sun],
  ['dark', 'Tối', Moon],
  ['system', 'Hệ thống', Monitor],
];

export function AccountMenu() {
  const panel = useRef<HTMLDivElement>(null);
  const { mode, palette, setMode, setPalette } = useTheme();

  return (
    <>
      <button className="avatar" popoverTarget="account-panel" aria-label={`Tài khoản: ${USER.name}`}>
        {USER.initials}
      </button>

      <div id="account-panel" ref={panel} className="popover account-panel" popover="auto">
        <div className="account-head">
          <span className="avatar static">{USER.initials}</span>
          <div className="grow">
            <strong className="truncate">{USER.name}</strong>
            <small className="truncate">{USER.email}</small>
          </div>
        </div>

        <section className="account-section" aria-labelledby="mode-label">
          <p id="mode-label" className="nav-label">Giao diện</p>
          <div className="segmented" role="radiogroup" aria-labelledby="mode-label">
            {MODES.map(([value, label, Icon]) => (
              <button key={value} role="radio" aria-checked={mode === value} onClick={() => setMode(value)}>
                <Icon aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </section>

        <section className="account-section" aria-labelledby="palette-label">
          <p id="palette-label" className="nav-label">Bảng màu</p>
          <div className="palettes" role="radiogroup" aria-labelledby="palette-label">
            {PALETTES.map(({ id, label }) => (
              <button key={id} role="radio" aria-checked={palette === id} onClick={() => setPalette(id)}>
                {/* data-palette scopes the tokens, so the swatch always shows the real colour */}
                <span className="pal-swatch" data-palette={id} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </section>

        <nav className="account-links" aria-label="Tài khoản">
          {ACCOUNT_ITEMS.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => panel.current?.hidePopover()}>
              <Icon aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
