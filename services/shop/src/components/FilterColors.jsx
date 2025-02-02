import React from 'react';
import { filterColorDitchs } from '@/utils/constants/filterColorDitchs.js';
import FilterColor from './UI/FilterColor/FilterColor';
import cl from '@/utils/styles/FilterColors.module.scss'

const FilterColors = () => {
    return (
        <div className={cl.colors__group}>
            <h3 className={cl.filters__title}>Кольори</h3>
            <div className={cl.colors__palette}>
                {filterColorDitchs.map((ditch) => (
                    <FilterColor name={ditch.name} color={ditch.color} id={ditch.id} />
                ))}
            </div>
        </div>
    );
};

//className={cl.color__palette}

export default FilterColors;