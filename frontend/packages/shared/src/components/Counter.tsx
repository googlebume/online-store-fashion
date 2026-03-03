import React from 'react';
import Button from './UI/Button/Button';
import { updateQuantity, getCartItems } from '../../../../services/shop/src/state/basketState';
import cl from '@packages/shared/src/utils/styles/modules/Counter.module.scss'

interface CounterProps {
    productName: string;
    initialQuantity?: number;
}

const Counter: React.FC<CounterProps> = ({ productName, initialQuantity = 1 }) => {
    // Знаходимо актуальну кількість товару в кошику
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




