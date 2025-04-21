// import React, { useState, useEffect } from 'react';
// // import cl from '../utils/styles/CountControl.module.scss'
// import CountControl from './UI/CountControl/CountControl';
// import { exportAllPrices, getAllProducts } from '../../../../services/shop/src/state/targetProductData'

// const quantityControlsStyle = {
//     display: 'flex',
//     alignItems: 'center',
//     border: '1px solid #ccc',
//     borderRadius: '4px',
//     marginRight: '16px',
//     height: 'fit-content'
// }
// const quantityValueStyle = {
//         padding: '8px 16px',
//         borderLeft: '1px solid #ccc',
//         borderRight: '1px solid #ccc',
// }

// interface CounterType {
//     productName?: string;
//     setSummaryRenderEvent?: React.Dispatch<React.SetStateAction<number>>;
// }

// const Counter: React.FC<CounterType> = ({ productName, setSummaryRenderEvent }) => {
//     const allProducts = getAllProducts();
    
//     const product = allProducts.find(p => p.name === productName);

//     const [count, setCount] = useState(1);

//     useEffect(() => {
//         if (product) {
//             exportAllPrices(product.name, +product.discount? +(product.price/product.discount)*100 : +product.price);
//         }
//     }, [product]);

//     const onMinus = () => {
//         if (count > 1 && product) {
//             const updatedCount = count - 1;
//             setCount(updatedCount);
//             exportAllPrices(product.name, updatedCount * +product.price,);
//             console.log(updatedCount * +product.price);
//         }
//         setSummaryRenderEvent(count);
//         console.log('minus ', count)
//     };

//     const onPlus = () => {
//         if (product) {
//             const updatedCount = count + 1;
//             setCount(updatedCount);
//             exportAllPrices(product.name, updatedCount * +product.price);
//             console.log(updatedCount * +product.price);
//         }
//         setSummaryRenderEvent(count);
//         console.log('pius ', count)
//     };

//     return (


//         <div  style={quantityControlsStyle}>
//             <CountControl onClick={onMinus}> - </CountControl>
//             <span style={quantityValueStyle}>{count}</span>
//             <CountControl onClick={onPlus}> + </CountControl>
//         </div>
//     );
// };


// export default Counter;

// Counter.tsx
import React from 'react';
import CountControl from './UI/CountControl/CountControl';
import { updateQuantity, getCartItems } from '../../../../services/shop/src/state/basketState';

const quantityControlsStyle = {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginRight: '16px',
    height: 'fit-content'
};

const quantityValueStyle = {
    padding: '8px 16px',
    borderLeft: '1px solid #ccc',
    borderRight: '1px solid #ccc',
};

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
        <div style={quantityControlsStyle}>
            <CountControl onClick={onMinus}> - </CountControl>
            <span style={quantityValueStyle}>{currentQuantity}</span>
            <CountControl onClick={onPlus}> + </CountControl>
        </div>
    );
};

export default Counter;