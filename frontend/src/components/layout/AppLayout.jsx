import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 ml-20 md:ml-24 flex flex-col">
        <TopHeader />
        <main className="flex-1 w-full px-8 pb-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
