'use client';

import { Bar } from '@/components/Bar/Bar';
import { Navigation } from '@/components/Navigation/Navigation';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { useAppSelector } from '@/store/store';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);

  return (
    <div className="wrapper">
      <div className="container">
        <main className="main">
          <Navigation />
          {children}
          <Sidebar />
        </main>
        {currentTrack && <Bar />}
      </div>
    </div>
  );
};
