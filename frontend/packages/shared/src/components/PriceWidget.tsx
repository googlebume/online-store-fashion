import React, { useState, useEffect } from 'react';
import cl from '@packages/shared/src/utils/styles/modules/PriceWidget.module.scss';
import PriceInput from './UI/form-controls/PriceInput/PriceInput';
import Button from '@packages/shared/src/components/UI/Button/Button';
import DoubleRangeInput from './UI/form-controls/DoubleRangeInput/DoubleRangeInput';
import { logFilterPipeline } from '@packages/shared/src/utils/debug/filterPipelineLog';

type PriceRange = {
    minPrice: number;
    maxPrice: number;
};

type PriceWidgetProps = {
    setSelectedPriceRange: (range: PriceRange) => void;
};

const PriceWidget: React.FC<PriceWidgetProps> = ({ setSelectedPriceRange }) => {
    const [minPrice, setMinPrice] = useState<number>(100);
    const [maxPrice, setMaxPrice] = useState<number>(5000);

    const handlePriceChoose = () => {
        const range = { minPrice, maxPrice };
        logFilterPipeline('PriceWidget → apply range', range);
        setSelectedPriceRange(range);
    };

    const handleMinPrice = (value: number) => {
        setMinPrice(value);
    };

    const handleMaxPrice = (value: number) => {
        setMaxPrice(value);
    };

    useEffect(() => {
        if (minPrice > maxPrice) {
            const temp = minPrice;
            setMinPrice(maxPrice);
            setMaxPrice(temp);
        }
    }, [minPrice, maxPrice]);

    return (
        <div className={cl.price__widget}>
            <h3 className={cl.filters__title}>Ціна</h3>
            <div className={cl.price__inputs}>
                <PriceInput
                    placeholder={'з'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMinPrice(Number(e.target.value))}
                    value={minPrice}
                />
                <PriceInput
                    placeholder={'до'}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMaxPrice(Number(e.target.value))}
                    value={maxPrice}
                />
                <Button text={'Ок'} variant={'submit-secondary'} onClick={handlePriceChoose} />
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


