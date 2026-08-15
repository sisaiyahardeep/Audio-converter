import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="flex h-screen flex-col bg-slate-50 text-slate-800 overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
