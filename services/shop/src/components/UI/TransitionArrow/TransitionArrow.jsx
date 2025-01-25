import React from 'react';
import cl from './TransitionArrow.module.scss';
import arrowInCircle from '@/assets/images/icons/arrowInCircle.png';

const TransitionArrow = ({ rotate = '0deg', left = '0', visible, onClick }) => {
    return (
        <button 
            className={`${cl.arrow__btn} ${visible ? cl.arrow__btn_visible : ''}`} // Коректне об'єднання класів
            style={{
                transform: `rotate(${rotate})`,
                left: `${left}`,
            }}
            onClick={onClick}
        >
            <img 
                src={arrowInCircle} 
                alt="arrow in circle" 
                className={cl.arrow__btn_icon}
            />
        </button>
    );
};

export default TransitionArrow;
