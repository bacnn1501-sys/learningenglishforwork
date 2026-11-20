import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { MobileNav } from './MobileNav';
import { OfflineIndicator } from '../common/OfflineIndicator';
import { NotificationPrompt } from '../common/NotificationPrompt';

export const AppLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-culinary-cream dark:bg-neutral-950 text-neutral-800 dark:text-neutral-100 transition-colors">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-8">
        {children}
      </main>
      <MobileNav />
      <OfflineIndicator />
      <NotificationPrompt />
    </div>
  );
};

