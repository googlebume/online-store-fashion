import React from 'react';
import cl from './FilterColor.module.scss'

const FilterColor = ({ name, color, key }) => {
    return (
        <>
            <input type="checkbox" className={cl.color__checkbox} id={`ditch_${key}`}/>
            <label className={cl.color__ditch} key={key} for={`ditch_${key}`}>
                <div className={cl.ditch__shade} style={{ backgroundColor: `${color}` }}> </div>
                <span className={cl.ditch__name}> {name} </span>
            </label>
        </>
    );
};

export default FilterColor;