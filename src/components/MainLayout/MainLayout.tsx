'use client';

import { Bar } from '@/components/Bar/Bar';
import { Navigation } from '@/components/Navigation/Navigation';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <Navigation />
          {children}
          <Sidebar />
        </main>
        <Bar />
      </div>
    </div>
  );
};
