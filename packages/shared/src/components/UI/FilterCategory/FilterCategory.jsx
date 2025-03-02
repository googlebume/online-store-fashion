import React from 'react';
import cl from './FilterCategory.module.scss'


const FilterCategory = ({ listTitle, nameAttr, lis }) => {
    return (
        <div className={cl.filters__group}>
            <h3 className={cl.filters__title}>{listTitle}</h3>
            <div className={cl.filters__container}>
                {lis.map((item) => (
                    <div className={cl.filters__filter} key={item.id}>
                        <input
                            type="radio"
                            className={cl.filter__input}
                            name={nameAttr}
                            value={item.valueAttr} 
                            id={`${item.valueAttr}_${item.id}`}/>
                        <label
                            htmlFor={`${item.valueAttr}_${item.id}`}
                            className={cl.filters__option}
                        > {item.categoryName}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterCategory;