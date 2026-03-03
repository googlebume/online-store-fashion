import React from 'react';
import cl from './ColorOptions.module.scss';
import { filterColorDitchs } from '../../../../../shop/src/utils/constants/filterColorDitchs';

type Color = {
    id: number;
    color: string;
};

type ColorOptionsType = {
    colorsList: Color[] | null | undefined;
    curentColor: String;
    setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
};

const ColorOptions = ({ colorsList, curentColor, setCurrentColor }: ColorOptionsType) => {
    if (!colorsList || colorsList.length === 0) {
        return <div className={cl.colorOptions}>Немає доступних кольорів</div>;
    }

    return (
        <div className={cl.colorOptions}>
            {colorsList.map((color) => {
                const matchedColor = filterColorDitchs.find(
                    (ditch) => ditch.colorTxt.toLowerCase() === color.color.toLowerCase()
                );

                const bgColor = matchedColor?.color || '#000';

                return (
                    <React.Fragment key={color.id}>
                        <input
                            type="radio"
                            id={`${color.id}`}
                            name="colorSelection"
                            className={cl.hiddenInput}
                            onChange={() => setCurrentColor(color.color)}
                            checked={curentColor === color.color}
                        />
                        <label
                            style={{ background: bgColor }}
                            htmlFor={`${color.id}`}
                            className={cl.colorButton}
                        ></label>
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default ColorOptions;
