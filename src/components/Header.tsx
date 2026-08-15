import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AudioLines, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Audio Converter', path: '/mp3-to-wav' }, // Defaulting to one
    { name: 'About', path: '/#about' },
    { name: 'FAQ', path: '/#faq' },
  ];

  return (
    <header className="h-16 flex items-center justify-between px-6 md:px-10 bg-white border-b border-slate-200 z-50 shrink-0">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
            <AudioLines className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">AudioConvert</span>
        </Link>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={cn(
              "hover:text-slate-900 transition-colors",
              location.pathname === link.path && link.path === '/' ? "text-indigo-600 border-b-2 border-indigo-600 pb-0.5" : 
              location.pathname.startsWith(link.path) && link.path !== '/' ? "text-indigo-600 border-b-2 border-indigo-600 pb-0.5" : ""
            )}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="hidden md:flex items-center">
        <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
          Get Started
        </button>
      </div>

      <div className="md:hidden">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2 shadow-lg bg-white border-b border-slate-200">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "block rounded-md px-3 py-2 text-base font-medium",
                  location.pathname === link.path || (location.pathname.startsWith(link.path) && link.path !== '/')
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
