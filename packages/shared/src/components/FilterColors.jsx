import React, {useState} from 'react';
import { filterColorDitchs } from '../../../../services/shop/src/utils/constants/filterColorDitchs';
import FilterColor from './UI/FilterColor/FilterColor';
import cl from '@packages/shared/src/utils/styles/modules/FilterColors.module.scss'

import { setUpdatedColors } from '../state/filtersState';

const FilterColors = ({ setSelectedColors }) => {
        const [SelectedColorsLocal, setSelectedColorsLocal] = useState([]);

        function getColorsValue({ value, checked }) {
                const updatedColors = checked
                    ? [...SelectedColorsLocal, value]
                    : SelectedColorsLocal.filter((category) => category !== value);
                setSelectedColorsLocal(updatedColors);
                setUpdatedColors(updatedColors);
                setSelectedColors && setSelectedColors(updatedColors);
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