import React from 'react';
import { useNavigate } from 'react-router-dom';

import { shopRoutes } from '../../routes/shop';
import Arrow from '../../assets/images/icons/arrowInCircle.svg';
import Button from '../../components/UI/Button/Button';
import cl from '@packages/shared/src/utils/styles/modules/ErrorNotFound.module.scss';

const ErrorNotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate(shopRoutes.shop);
    };

    const handleGoBack = () => {
        navigate(shopRoutes.shop);
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className={cl.errorPage}>
            <div className={cl.backgroundElements}>
                <div className={`${cl.floatingElement} ${cl.bounce}`} style={{ top: '20%', left: '10%' }}></div>
                <div className={`${cl.floatingElement} ${cl.float}`} style={{ top: '60%', right: '15%' }}></div>
                <div className={`${cl.floatingElement} ${cl.pulse}`} style={{ bottom: '30%', left: '20%' }}></div>
                <div className={`${cl.floatingElement} ${cl.bounce}`} style={{ top: '40%', right: '25%' }}></div>
            </div>

            <div className={cl.container}>
                <div className={cl.content}>
                    <div className={cl.illustration}>
                        <div className={cl.errorCode}>404</div>
                    </div>

                    <h1 className={cl.title}>Упс! Сторінка не знайдена</h1>
                    <p className={cl.subtitle}>Схоже, ви потрапили не туди</p>
                    <p className={cl.description}>
                        Сторінка, яку ви шукаєте, можливо була видалена,
                        перейменована або тимчасово недоступна.
                    </p>

                    <div className={cl.actions}>
                        <Button text='На головну' onClick={handleGoHome} />

                        <Button
                            text='Назад'
                            variant='submit-secondary'
                            img={Arrow}
                            onClick={handleGoBack}
                        />

                        <Button
                            text='Оновити'
                            variant='submit-secondary'
                            onClick={handleRefresh}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorNotFound;


