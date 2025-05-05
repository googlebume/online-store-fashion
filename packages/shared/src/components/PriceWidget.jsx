import React, { useEffect, useState } from 'react';
import cl from '@packages/shared/src/utils/styles/modules/PriceWidget.module.scss';
import PriceInput from './UI/PriceInput/PriceInput';
import SubmitButton from '@packages/shared/src/components/UI/SubmitButton/SubmitButton';
import DoubleRangeInput from './UI/DoubleRangeInput/DoubleRangeInput';

const PriceWidget = ({setSelectedPriceRange}) => {
    
    const [minPrice, setMinPrice] = useState(100);
    const [maxPrice, setMaxPrice] = useState(5000);

    const handlePriceChoose = () => {
        // const range = Math.abs(Math.abs(minPrice) - Math.abs(minPrice))
        setSelectedPriceRange({minPrice:minPrice, maxPrice:maxPrice})
    }

    function handleMinPrice(value) {
        setMinPrice(value);
    }

    function handleMaxPrice(value) {
        setMaxPrice(value);
    }


    function ifChangePlaces() {
        if (minPrice > maxPrice || maxPrice < minPrice) {
            return true;
        }
        return false
    }


    return (



        <div className={cl.price__widget}>
            <h3 className={cl.filters__title}>Ціна</h3>
            <div className={cl.price__inputs}>
                <PriceInput
                    placeholder={'Від'}
                    onChange={e => handleMinPrice(Number(e.target.value))}
                    value={ifChangePlaces() ? setMaxPrice(minPrice) : minPrice}
                />
                <PriceInput
                    placeholder={'До'}
                    onChange={e => handleMaxPrice(Number(e.target.value))}
                    value={ifChangePlaces() ? setMinPrice(maxPrice) : maxPrice}
                />
                <SubmitButton text={'Ок'} onClick={handlePriceChoose}/>
            </div>
            <DoubleRangeInput 
                minInRange={100} 
                maxInRange={5000} 
                setMinPrice={handleMinPrice} 
                setMaxPrice={handleMaxPrice}
                minValue={minPrice}
                maxValue={maxPrice}
            />
        </div>
    );
};

export default PriceWidget;
