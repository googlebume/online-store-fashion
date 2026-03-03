import React, { useState } from 'react';
import cl from '@/utils/styles/modules/ColorSelection.module.scss'
import ColorOptions from './UI/ColorOptions/ColorOptions';

type Color = {
    id: number;
    color: string;
}
type ColorSelectionType = {
    colorsList: Color[];
    curentColor: String;
    setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
}

const ColorSelection: React.FC<ColorSelectionType> = ({colorsList, curentColor, setCurrentColor}) => {
    console.log('cc',curentColor)
    return (
        <div className={cl.colorSelection}>
            <h3 className={cl.colorTitle}>
                Колір: <span className={cl.selectedColor}>{curentColor}</span>
            </h3>
            <ColorOptions colorsList={colorsList} curentColor={curentColor} setCurrentColor={setCurrentColor}/>
        </div>
    );
};

export default ColorSelection;