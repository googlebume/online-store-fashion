import React from 'react';
import { Outlet } from 'react-router-dom';
import cl from './App.module.scss';

export const App = () => {
  return (
    <div className={cl.layout}>
      <main className={cl.content}>
        <Outlet />
      </main>
    </div>
  );
};
