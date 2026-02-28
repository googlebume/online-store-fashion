import React from 'react';
import cl from './FilterColor.module.scss'

const FilterColor = ({ name, color, colorTxt, id, getColorsValue }) => {
    return (
        <>
            <input type="checkbox" className={cl.color__checkbox} value={colorTxt} id={`ditch_${id}`} onChange={e => getColorsValue({value: e.target.value, checked: e.target.checked})}/>
            <label className={cl.color__ditch} htmlFor={`ditch_${id}`}>
                <div className={cl.ditch__shade} style={{ backgroundColor: `${color}` }}> </div>
                <span className={cl.ditch__name}>{name}</span>
            </label>
        </>
    );
    
};

export default FilterColor;

