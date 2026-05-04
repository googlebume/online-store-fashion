import React from 'react';
import { Outlet } from 'react-router-dom';
import cl from './App.module.scss';
import AnalyticsRouteTracker from '@packages/shared/src/components/AnalyticsRouteTracker';

export const App = () => {
  return (
    <div className={cl.layout}>
      <AnalyticsRouteTracker />
      <main className={cl.content}>
        <Outlet />
      </main>
    </div>
  );
};
