// import React, {useState} from 'react';
// import FilterCategory from './UI/FilterCategory/FilterCategory';
// import {filterCategorys} from '@/utils/constants/filterCategorys'
// import { setUpdatedCategories } from "../state/filtersState";

// const FilterCategorys = () => {

//     // const [selectedCategories, setSelectedCategories] = useState([]);
    
//         function getCategoriesValue({value, checked}) {
//             setUpdatedCategories((prevCategories) => {
//                 const updatedCategories = checked
//                     ? [...prevCategories, value]
//                     : prevCategories.filter((category) => category !== value);
        
//                 console.log(updatedCategories); // <-- Здесь уже актуальное состояние
//                 setUpdatedCategories(updatedCategories);
//                 return updatedCategories;
//             });
//         }

//     return (
        
//         <>
//             {filterCategorys.map((block) => (
//                 <FilterCategory key={block.nameAttr} listTitle={block.listTitle} nameAttr={block.nameAttr} lis={block.lis} getCategoriesValue={getCategoriesValue}/>
//             ))}
//         </>
//     );
// };

// export default FilterCategorys;

import React, { useState, useEffect } from 'react';
import FilterCategory from './UI/FilterCategory/FilterCategory';
import { filterCategorys } from '@/utils/constants/filterCategorys';
import { setUpdatedCategories, getUpdatedCategories } from "../state/filtersState";

const FilterCategorys = () => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    function getCategoriesValue({ value, checked }) {
        const updatedCategories = checked
            ? [...selectedCategories, value]
            : selectedCategories.filter((category) => category !== value);
    
        setSelectedCategories(updatedCategories);
        setUpdatedCategories(updatedCategories);
    }

    return (
        <>
            {filterCategorys.map((block) => (
                <FilterCategory 
                    key={block.nameAttr} 
                    listTitle={block.listTitle} 
                    nameAttr={block.nameAttr} 
                    lis={block.lis} 
                    getCategoriesValue={getCategoriesValue} 
                />
            ))}
        </>
    );
};

export default FilterCategorys;
