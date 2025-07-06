import React from 'react';

// Виправлений імпорт стилів:
import cl from '@packages/shared/src/utils/styles/modules/ErrorNotFound.module.scss';

const ErrorNotFound = () => {
  const handleGoHome = () => {
    console.log('Redirect to home');
  };

  const handleGoBack = () => {
    console.log('Go back');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={cl.errorPage}>
      <div className={cl.backgroundElements}>
        <div className={`${cl.floatingElement} ${cl.bounce}`} style={{top: '20%', left: '10%'}}></div>
        <div className={`${cl.floatingElement} ${cl.float}`} style={{top: '60%', right: '15%'}}></div>
        <div className={`${cl.floatingElement} ${cl.pulse}`} style={{bottom: '30%', left: '20%'}}></div>
        <div className={`${cl.floatingElement} ${cl.bounce}`} style={{top: '40%', right: '25%'}}></div>
      </div>
      
      <div className={cl.container}>
        <div className={cl.content}>
          <div className={cl.illustration}>
            <div className={cl.errorCode}>404</div>
          </div>
          
          <h1 className={cl.title}>Упс! Сторінка не знайдена</h1>
          <p className={cl.subtitle}>Схоже, ви потрапили не туди</p>
          <p className={cl.description}>
            Сторінка, яку ви шукаете, можливо була видалена, 
            перейменована або тимчасово недоступна.
          </p>
          
          <div className={cl.actions}>
            <button 
              className={cl.primaryButton}
              onClick={handleGoHome}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              На головну
            </button>
            
            <button 
              className={cl.secondaryButton}
              onClick={handleGoBack}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5"/>
                <path d="M12 19l-7-7 7-7"/>
              </svg>
              Назад
            </button>
            
            <button 
              className={cl.secondaryButton}
              onClick={handleRefresh}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 4v6h6"/>
                <path d="M23 20v-6h-6"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
              </svg>
              Оновити
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotFound;