import React, { useState } from 'react';
import FilterCategory from './UI/form-controls/FilterCategory/FilterCategory';
import { filterCategorys } from '../../../../services/shop/src/utils/constants/filterCategorys';

function FilterCategorys({ setUpdatedCategoriesState, setUpdatedTypesState }) {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);

    function getCategoriesValue({ value, checked, name }) {
        if (name === 'category') {
            const updatedCategories = checked
                ? [...selectedCategories, value]
                : selectedCategories.filter((category) => category !== value);
            setSelectedCategories(updatedCategories);
            setUpdatedCategoriesState && setUpdatedCategoriesState(updatedCategories);
        } else if (name === 'type') {
            const updatedTypes = checked
                ? [...selectedTypes, value]
                : selectedTypes.filter((type) => type !== value);
            setSelectedTypes(updatedTypes);
            setUpdatedTypesState && setUpdatedTypesState(updatedTypes);
        }
    }

    return (
        <>
            {filterCategorys.map((block) => (
                <FilterCategory 
                    key={block.nameAttr} 
                    listTitle={block.listTitle} 
                    nameAttr={block.nameAttr} 
                    lis={block.lis} 
                    getCategoriesValue={(args) => getCategoriesValue({ ...args, name: block.nameAttr })} 
                />
            ))}
        </>
    );
}

export default FilterCategorys;


