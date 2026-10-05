import { Suspense, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { findNav } from '../nav';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppLayout() {
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  const title = findNav(pathname)?.label;

  useEffect(() => {
    document.title = `${title ?? 'Không tìm thấy'} · Coffee Admin`;
    window.scrollTo(0, 0);
    setNavOpen(false);
  }, [pathname, title]);

  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setNavOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [navOpen]);

  return (
    <>
      <a className="skip-link" href="#main">Bỏ qua điều hướng</a>
      <div className="app">
        <Sidebar open={navOpen} />
        <div className={`backdrop ${navOpen ? 'show' : ''}`} onClick={() => setNavOpen(false)} aria-hidden="true" />
        <div className="main-col">
          <Topbar title={title} navOpen={navOpen} onMenu={() => setNavOpen((o) => !o)} />
          <Suspense fallback={<div className="content" aria-busy="true" />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </>
  );
}
