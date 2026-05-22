import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ExternalLink, Home, Menu, Search, X } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinkClass = (path: string) =>
    `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold ${
      location.pathname === path
        ? 'bg-ugc-navy/10 text-ugc-navy'
        : 'text-slate-600 hover:bg-slate-100 hover:text-ugc-navy'
    }`;

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-3 transition-colors duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold rounded-lg"
          >
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white p-0.5">
              <img
                src="/images/ugc.jpg"
                alt="University Grants Commission Sri Lanka"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-display text-base font-bold leading-tight text-ugc-navy sm:text-lg">
                Computing Programs Directory
              </h1>
              <p className="text-xs text-slate-500">Standing Committee of Computing</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <Link to="/" className={navLinkClass('/')}>
              <Home className="h-4 w-4" aria-hidden="true" />
              <span>Home</span>
            </Link>
            <Link to="/programs" className={navLinkClass('/programs')}>
              <Search className="h-4 w-4" aria-hidden="true" />
              <span>Programs</span>
            </Link>
            <a
              href="https://www.ugc.ac.lk/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-2 rounded-md bg-ugc-gold px-3 py-2 text-sm font-semibold text-ugc-navy transition-colors duration-200 hover:bg-ugc-goldSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold focus-visible:ring-offset-2"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span>Visit UGC Sri Lanka</span>
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-md p-2 text-ugc-navy hover:bg-slate-100 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <nav className="border-t border-slate-200 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              <Link to="/" className={navLinkClass('/')} onClick={closeMobile}>
                <Home className="h-4 w-4" aria-hidden="true" />
                <span>Home</span>
              </Link>
              <Link to="/programs" className={navLinkClass('/programs')} onClick={closeMobile}>
                <Search className="h-4 w-4" aria-hidden="true" />
                <span>Programs</span>
              </Link>
              <a
                href="https://www.ugc.ac.lk/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobile}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-ugc-gold px-3 py-2 text-sm font-semibold text-ugc-navy hover:bg-ugc-goldSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                <span>Visit UGC Sri Lanka</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
