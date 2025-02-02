import React from 'react';
import cl from './FilterColor.module.scss'

const FilterColor = ({ name, color, id }) => {
    return (
        <>
            <input type="checkbox" className={cl.color__checkbox} id={`ditch_${id}`} />
            <label className={cl.color__ditch} htmlFor={`ditch_${id}`}>
                <div className={cl.ditch__shade} style={{ backgroundColor: `${color}` }}> </div>
                <span className={cl.ditch__name}>{name}</span>
            </label>
        </>
    );
    
};

export default FilterColor;