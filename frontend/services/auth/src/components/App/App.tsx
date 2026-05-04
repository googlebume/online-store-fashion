import React from 'react';
import cl from './App.module.scss';
import { Outlet } from 'react-router-dom';
import AnalyticsRouteTracker from '@packages/shared/src/components/AnalyticsRouteTracker';

export const App = () => {
  return (
    <div className={cl.registerWrapper}>
      <AnalyticsRouteTracker />
      <Outlet/>
    </div>
  );
};
