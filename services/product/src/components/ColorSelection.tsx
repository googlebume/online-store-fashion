import React from 'react';
import cl from '@/utils/styles/ColorSelection.module.scss'
import ColorOptions from './UI/ColorOptions/ColorOptions';

const ColorSelection = () => {
    return (
        <div className={cl.colorSelection}>
            <h3 className={cl.colorTitle}>
                Колір: <span className={cl.selectedColor}>Чорний</span>
            </h3>
            <ColorOptions />
        </div>
    );
};

export default ColorSelection;