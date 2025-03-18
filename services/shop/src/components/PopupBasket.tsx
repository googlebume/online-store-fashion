import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
import cl from "../utils/styles/PopupBasket.module.scss";
import ClosePopupCross from '@packages/shared/src/components/UI/ClosePopupCross/ClosePopupCross'
import BasketOverview from './BasketOverview';
import BasketDelivery from './BasketDelivery';

// Типізація пропсів для PopupBasket
interface PopupBasketProps {
    setBasketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
    basketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopupBasket: React.FC<PopupBasketProps> = ({ setBasketOpenStatus, basketOpenStatus }) => {
    useEffect(() => {
        basketOpenStatus ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = "";
        };
    }, [basketOpenStatus])

    return ReactDOM.createPortal(
        <div className={cl.modalOverlay} onClick={e => { setBasketOpenStatus(false) }}>
            <div className={cl.modalContent} style={{
                margin: '0, auto',
                width: '1000px',
                height: '600px',
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
            }} onClick={(e) => e.stopPropagation()}>

                <BasketOverview />
                <BasketDelivery />
            </div>
            <ClosePopupCross setOpenStatus={setBasketOpenStatus} />
        </div>,
        document.getElementById("modal-root")!
    );
};

export default PopupBasket;


// {cartItems.length > 0 ? (
//     <ul className={cl.cartList}>
//         {cartItems.map((item) => (
//             <li key={item.id} className={cl.cartItem}>
//                 <img src={item.image} alt={item.name} className={cl.itemImage} />
//                 <div className={cl.itemDetails}>
//                     <p className={cl.itemName}>{item.name}</p>
//                     <p className={cl.itemPrice}>{item.price} ₴</p>
//                 </div>
//             </li>
//         ))}
//     </ul>
// ) : (
//     <p className={cl.emptyCart}>Ваш кошик порожній</p>
// )}