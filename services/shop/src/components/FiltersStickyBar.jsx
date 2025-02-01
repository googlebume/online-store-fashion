import React from 'react';

import FilterCategorys from './FilterCategorys';
import PriceWidget from './PriceWidget';
import FilterColors from './FilterColors';

const FiltersStickyBar = () => {
    return (
        <aside style={{
            minWidth: '292px',
            position: 'sticky',
            top: '0px',
            margin: '0 8px 0 0'
        }}>
            <FilterCategorys />
            <PriceWidget />
            <FilterColors />
        </aside>
    );
};

export default FiltersStickyBar;