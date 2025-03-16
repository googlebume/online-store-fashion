import React from "react";
import cl from "./FilterCategory.module.scss";

const FilterCategory = ({ listTitle, nameAttr, lis, getCategoriesValue }) => {
    return (
        <div className={cl.filters__group}>
            <h3 className={cl.filters__title}>{listTitle}</h3>
            <div className={cl.filters__container}>
                {lis.map((item) => (
                    <div className={cl.filters__filter} key={item.id}>
                        <input
                            type="checkbox"
                            className={cl.filter__input}
                            name={nameAttr}
                            value={item.valueAttr}
                            id={`${item.valueAttr}_${item.id}`}
                            onChange={(e) => getCategoriesValue({ value: e.target.value, checked: e.target.checked })}

                        />
                        <label
                            htmlFor={`${item.valueAttr}_${item.id}`}
                            className={cl.filters__option}
                        >
                            {item.categoryName}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterCategory;



// import React from 'react';
// import cl from './FilterCategory.module.scss';

// const FilterCategory = ({ listTitle, nameAttr, lis }) => {
//     // Функція для обробки зміни фільтра
//     const handleFilterChange = async (event) => {
//         const selectedValue = event.target.value;

//         try {
//             const response = await fetch('http://localhost:3004/filters-handler', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ [nameAttr]: selectedValue }),
//             });

//             if (!response.ok) {
//                 throw new Error('Помилка відправки даних на сервер');
//             }

//             console.log('Фільтр змінено:', { [nameAttr]: selectedValue });
//         } catch (error) {
//             console.error('Помилка:', error);
//         }
//     };

//     return (
//         <div className={cl.filters__group}>
//             <h3 className={cl.filters__title}>{listTitle}</h3>
//             <div className={cl.filters__container}>
//                 {lis.map((item) => (
//                     <div className={cl.filters__filter} key={item.id}>
//                         <input
//                             type="checkbox"
//                             className={cl.filter__input}
//                             name={nameAttr}
//                             value={item.valueAttr}
//                             id={`${item.valueAttr}_${item.id}`}
//                             onChange={handleFilterChange} // Виклик функції при зміні вибору
//                         />
//                         <label
//                             htmlFor={`${item.valueAttr}_${item.id}`}
//                             className={cl.filters__option}
//                         >
//                             {item.categoryName}
//                         </label>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default FilterCategory;
