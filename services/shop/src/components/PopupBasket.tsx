import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import cl from "../utils/styles/PopupBasket.module.scss";
import ClosePopupCross from '@packages/shared/src/components/UI/ClosePopupCross/ClosePopupCross'
import BasketOverview from './BasketOverview';
import BasketDelivery from './BasketDelivery';
import BasketSummary from './BasketSummary';

// Типізація пропсів для PopupBasket
interface PopupBasketProps {
    setBasketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
    basketOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopupBasket: React.FC<PopupBasketProps> = ({ setBasketOpenStatus, basketOpenStatus }) => {
    useEffect(() => {
        return () => {
            document.body.style.overflow = "";
        };
    }, [basketOpenStatus])

    const [summaryRenderEvent, setSummaryRenderEvent] = useState(0);
    return ReactDOM.createPortal(
        <div className={cl.modalOverlay} style={{ alignContent: 'center', padding: '0 12px' }} onClick={e => { setBasketOpenStatus(false) }}>
            <div className={cl.modalContent} style={{
                width: '1300px',
                height: '700px',
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '1.8fr 1fr',
                gridTemplateRows: '1fr auto',
                gap: '0px',
                position: 'relative',
                overflowY: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
                <ClosePopupCross setOpenStatus={setBasketOpenStatus} />
                <BasketOverview setSummaryRenderEvent={setSummaryRenderEvent} />
                <BasketDelivery />
                <BasketSummary summaryRenderEvent={summaryRenderEvent} />
            </div>
        </div>,
        document.getElementById("modal-root")!
    );
};

export default PopupBasket;