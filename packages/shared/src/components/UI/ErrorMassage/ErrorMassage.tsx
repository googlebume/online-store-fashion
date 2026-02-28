import React from 'react';
import cl from './ErrorMassage.module.scss'

const ErrorMassage = ({massage}: {massage?:string}) => {
    return (
        <div>
            <span className={cl.massage}>
                {massage ? massage : 'Непередбачувана помилка. Спробуйте ще раз!'}
            </span>
        </div>
    );
};

export default ErrorMassage;


