import React, { useEffect, useState } from 'react';
import Button from './UI/Button/Button';
import { updateQuantity, getCartItems, subscribeToCartChanges } from '../state/basketState';
import cl from '@packages/shared/src/utils/styles/modules/Counter.module.scss'

interface CounterProps {
    productName: string;
    initialQuantity?: number;
}

const Counter: React.FC<CounterProps> = ({ productName, initialQuantity = 1 }) => {
    const [, setVersion] = useState(0);
    useEffect(() => {
        return subscribeToCartChanges(() => setVersion((v) => v + 1));
    }, []);

    const cartItems = getCartItems();
    const product = cartItems.find(p => p.name === productName);
    const currentQuantity = product ? product.quantity : initialQuantity;

    const onMinus = () => {
        if (currentQuantity > 1) {
            updateQuantity(productName, currentQuantity - 1);
        }
    };

    const onPlus = () => {
        updateQuantity(productName, currentQuantity + 1);
    };

    return (
        <div className={cl.quantityControls}>
            <Button variant='counter' onClick={onMinus}> - </Button>
            <span className={cl.quantityValue}>{currentQuantity}</span>
            <Button variant='counter' onClick={onPlus}> + </Button>
        </div>
    );
};

export default Counter;




