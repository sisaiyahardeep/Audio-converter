import React from 'react';
import { Link } from 'react-router-dom';
import { AudioLines } from 'lucide-react';

export function Footer() {
  return (
    <footer className="h-auto md:h-12 py-4 md:py-0 bg-white border-t border-slate-200 px-6 md:px-10 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 font-medium shrink-0 gap-4 md:gap-0">
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
        <span>&copy; 2026 AudioConvert. All Rights Reserved.</span>
        <Link to="/#privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
        <Link to="/#terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
        <Link to="/#contact" className="hover:text-slate-900 transition-colors">Contact</Link>
      </div>
      <div className="flex items-center gap-1">
        <span>Powered by</span>
        <a href="https://sisaiyarecords.in" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline">
          Sisaiya Records
        </a>
      </div>
    </footer>
  );
}
