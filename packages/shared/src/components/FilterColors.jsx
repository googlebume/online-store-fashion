import React, {useState} from 'react';
import { filterColorDitchs } from '@/utils/constants/filterColorDitchs.js';
import FilterColor from './UI/FilterColor/FilterColor';
import cl from '../utils/styles/FilterColors.module.scss'

import { setUpdatedColors } from '../state/filtersState';
const FilterColors = () => {

    const [SelectedColors, setSelectedColors] = useState([]);

    function getColorsValue({ value, checked }) {
            setSelectedColors((prevColors) => {
                const updatedColors = checked
                    ? [...prevColors, value]
                    : prevColors.filter((category) => category !== value);
    
                setUpdatedColors(updatedColors);
                return updatedColors;
            });
        }

    return (
        <div className={cl.colors__group}>
            <h3 className={cl.filters__title}>Кольори</h3>
            <div className={cl.colors__palette}>
                {filterColorDitchs.map((ditch) => (
                    <FilterColor name={ditch.name} color={ditch.color} colorTxt={ditch.colorTxt} id={ditch.id} getColorsValue={getColorsValue} />
                ))}
            </div>
        </div>
    );
};


export default FilterColors;