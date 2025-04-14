import React from 'react';
import cl from './ColorOptions.module.scss';

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
            {colorsList.map((color) => (
                <React.Fragment key={color.id}>
                    <input
                        type="radio"
                        id={`${color.id}`}
                        name="colorSelection"
                        className={cl.hiddenInput}
                        onChange={() => {setCurrentColor(color.color)}}
                        checked={curentColor === color.color}
                    />
                    <label
                        style={{ background: color.color || '#000' }}
                        htmlFor={`${color.id}`}
                        className={cl.colorButton}
                    ></label>
                </React.Fragment>
            ))}
        </div>
    );
};

export default ColorOptions;