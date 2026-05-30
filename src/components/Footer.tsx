import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-ugc-navy text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-ugc-gold/30 bg-white p-0.5">
                <img
                  src={`${import.meta.env.BASE_URL}images/ugc.jpg`}
                  alt="University Grants Commission Sri Lanka"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-ugc-gold">
                  University Grants Commission
                </p>
                <p className="text-xs text-slate-400">Standing Committee of Computing</p>
              </div>
            </div>
            <p className="text-sm text-slate-400">Sri Lanka</p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-ugc-gold">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 transition-colors hover:text-ugc-goldSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold rounded"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/programs"
                  className="text-slate-300 transition-colors hover:text-ugc-goldSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold rounded"
                >
                  Programs
                </Link>
              </li>
              <li>
                <a
                  href="https://www.ugc.ac.lk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-300 transition-colors hover:text-ugc-goldSoft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugc-gold rounded"
                >
                  Visit UGC Sri Lanka
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wide text-ugc-gold">
              About This Directory
            </h3>
            <p className="text-sm leading-relaxed text-slate-400">
              This directory is a curated initiative by the Standing Committee of Computing,
              University Grants Commission (UGC) of Sri Lanka, to showcase undergraduate and
              postgraduate computing programs offered by UGC-approved state universities and
              higher education institutes.
            </p>
          </div>
        </div>

        <div className="my-8 border-t border-ugc-gold/30" />

        <p className="text-center text-xs text-slate-400 sm:text-sm">
          Copyright &copy; 2026 University Grants Commission - Sri Lanka. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
