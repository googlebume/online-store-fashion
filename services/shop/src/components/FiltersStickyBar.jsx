import React from 'react';

import FilterCategorys from './FilterCategorys';
import PriceWidget from './PriceWidget';

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
        </aside>
    );
};

export default FiltersStickyBar;