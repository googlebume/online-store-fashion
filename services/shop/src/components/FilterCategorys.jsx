import React from 'react';
import FilterCategory from './UI/FilterCategory/FilterCategory';

import {filterCategorys} from '@/utils/constants/filterCategorys'

const FilterCategorys = () => {
    return (
        <>
            {filterCategorys.map((block) => (
                <FilterCategory key={block.nameAttr} listTitle={block.listTitle} nameAttr={block.nameAttr} lis={block.lis} />
            ))}
        </>
    );
};

export default FilterCategorys;