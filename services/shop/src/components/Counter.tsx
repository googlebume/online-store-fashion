import React, { useState } from 'react';
import CountControl from './UI/CountControl/CountControl';
import { exportAllPrices, getAllProducts } from '@/state/targetProductData'


interface CounterType {
    productName: string;
    setSummaryRenderEvent: React.Dispatch<React.SetStateAction<number>>;
}

const Counter: React.FC<CounterType> = ({ productName, setSummaryRenderEvent }) => {
    const allProducts = getAllProducts();
    const product = allProducts.find(p => p.name === productName);

    const [count, setCount] = useState(1);

    const onMinus = () => {
        if (count > 1 && product) {
            const updatedCount = count - 1;
            setCount(updatedCount);
            exportAllPrices(product.name, updatedCount * +product.price, );
            console.log(updatedCount * +product.price);
        }
        setSummaryRenderEvent(count);
        console.log('minus ', count)
    };

    const onPlus = () => {
        if (product) {
            const updatedCount = count + 1;
            setCount(updatedCount);
            exportAllPrices(product.name, updatedCount * +product.price);
            console.log(updatedCount * +product.price);
        }
        setSummaryRenderEvent(count);
        console.log('pius ', count)
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <CountControl onClick={onMinus}> - </CountControl>
            <span style={{ padding: '0 8px', fontSize: '16px' }}>{count}</span>
            <CountControl onClick={onPlus}> + </CountControl>
        </div>
    );
};


export default Counter;