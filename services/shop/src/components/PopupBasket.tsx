// import React, { useEffect, useState } from 'react';
// import ReactDOM from "react-dom";
// import cl from "../utils/styles/PopupBasket.module.scss";
// import ClosePopupCross from '@packages/shared/src/components/UI/ClosePopupCross/ClosePopupCross'
// import BasketOverview from './BasketOverview';
// import BasketDelivery from './BasketDelivery';
// import BasketSummary from './BasketSummary';

// // Типізація пропсів для PopupBasket
// interface PopupBasketProps {
//     setBasketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
//     basketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const PopupBasket: React.FC<PopupBasketProps> = ({ setBasketOpenStatus, basketOpenStatus }) => {
//     useEffect(() => {
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [basketOpenStatus])

//     const [summaryRenderEvent, setSummaryRenderEvent] = useState(0);
//     return ReactDOM.createPortal(
//         <div 
//             className={cl.modalOverlay} 
//             onClick={e => { setBasketOpenStatus(false) }}
//         >
//             <div 
//                 className={cl.modalContent} 
//                 onClick={(e) => e.stopPropagation()}
//             >
//                 <ClosePopupCross setOpenStatus={setBasketOpenStatus} />
//                 <BasketOverview setSummaryRenderEvent={setSummaryRenderEvent} />
//                 <BasketDelivery />
//                 <BasketSummary summaryRenderEvent={summaryRenderEvent} />
//             </div>
//         </div>,
//         document.getElementById("modal-root")!
//     );
// };

// export default PopupBasket;

// import React, { useEffect, useState } from 'react';
// import ReactDOM from "react-dom";
// import cl from "../utils/styles/PopupBasket.module.scss";
// import ClosePopupCross from '@packages/shared/src/components/UI/ClosePopupCross/ClosePopupCross'
// import BasketOverview from './BasketOverview';
// import BasketDelivery from './BasketDelivery';
// import BasketSummary from './BasketSummary';
// import { getAllProducts } from '@/state/targetProductData';
// import EmptyBasket from './EmptyBasket';

// interface PopupBasketProps {
//     setBasketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
//     basketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
// }

// const PopupBasket: React.FC<PopupBasketProps> = ({ setBasketOpenStatus, basketOpenStatus }) => {
//     const [summaryRenderEvent, setSummaryRenderEvent] = useState(0);
//     const [productsInCart, setProductsInCart] = useState(getAllProducts());

//     useEffect(() => {
//         const update = () => setProductsInCart(getAllProducts());
//         // Примусове оновлення при відкритті
//         update();

//         // Розблокуємо scroll при закритті модалки
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, [basketOpenStatus]);

//     const hasProducts = productsInCart.length > 0;

//     return ReactDOM.createPortal(
//         <div 
//             className={cl.modalOverlay} 
//             onClick={() => setBasketOpenStatus(false)}
//         >
//                 {hasProducts ? (
//                     <div 
//                     className={cl.modalContent} 
//                     onClick={(e) => e.stopPropagation()}
//                 >
//                     <ClosePopupCross setOpenStatus={setBasketOpenStatus} />
//                     <>
//                         <BasketOverview setSummaryRenderEvent={setSummaryRenderEvent} />
//                         <BasketDelivery />
//                         <BasketSummary summaryRenderEvent={summaryRenderEvent} />
//                     </>
//                 </div>
//                 ) : (
//                     <div className={cl.basket}>
//                         <EmptyBasket />
//                     </div>

//                 )}

//         </div>,
//         document.getElementById("modal-root")!
//     );
// };

// export default PopupBasket;

// PopupBasket.tsx
import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import cl from "@shop/utils/styles/modules/PopupBasket.module.scss";
import ClosePopupCross from '@packages/shared/src/components/UI/ClosePopupCross/ClosePopupCross';
import BasketOverview from './BasketOverview';
import BasketDelivery from './BasketDelivery';
import BasketSummary from './BasketSummary';
import EmptyBasket from './EmptyBasket';
import { getCartItems, subscribeToCartChanges } from '../state/basketState';

interface PopupBasketProps {
    setBasketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
    basketOpenStatus: boolean; // Виправлено тип з React.Dispatch<> на boolean
}

const PopupBasket: React.FC<PopupBasketProps> = ({ setBasketOpenStatus, basketOpenStatus }) => {
    const [productsInCart, setProductsInCart] = useState(getCartItems());

    useEffect(() => {
        // При відкритті модалки блокуємо скроллінг
        document.body.style.overflow = "hidden";

        // Підписуємося на зміни в кошику
        const unsubscribe = subscribeToCartChanges(() => {
            setProductsInCart(getCartItems());
        });

        // Одразу оновлюємо дані при монтуванні
        setProductsInCart(getCartItems());

        // Розблокуємо скроллінг при закритті модалки
        return () => {
            document.body.style.overflow = "";
            unsubscribe();
        };
    }, []);

    const hasProducts = productsInCart.length > 0;

    return ReactDOM.createPortal(
        <div
            className={cl.modalOverlay}
            onClick={() => setBasketOpenStatus(false)}
        >
            {hasProducts ? (
                <div
                    className={cl.modalContent}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ClosePopupCross setOpenStatus={setBasketOpenStatus} />
                    <>
                        <BasketOverview />
                        <BasketDelivery />
                        <BasketSummary />
                    </>
                </div>
            ) : (
                <div
                    className={cl.basket}
                    onClick={(e) => e.stopPropagation()}
                >
                    <ClosePopupCross setOpenStatus={setBasketOpenStatus} />
                    <EmptyBasket />
                </div>
            )}
        </div>,
        document.getElementById("modal-root")!
    );
};

export default PopupBasket;