import React from 'react';
import cl from './TransitionArrow.module.scss';
import ArrowInCircle from '@packages/shared/src/assets/images/icons/arrowInCircle.svg';
import variables from '@packages/shared/src/utils/styles/colorScheme'

const TransitionArrow = ({ rotate = '0deg', left = '0', visible, onClick }) => {
    return (
        <button 
            className={`${cl.arrow__btn} ${visible ? cl.arrow__btn_visible : ''}`}
            style={{
                transform: `rotate(${rotate})`,
                left: `${left}`,
            }}
            onClick={onClick}
        >
            <ArrowInCircle height='35px' width='35px' color={`${variables.white}`} fill={`${variables.white}`}/>
        </button>
    );
};

export default TransitionArrow;
