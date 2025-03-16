import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import FiltersStickyBar from "./FiltersStickyBar";
import cl from "../utils/styles/PopupFilterBar.module.scss";

const PopupFilterBar = ({ isOpen, setIsOpen }) => {
    if (!isOpen) return null;

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return ReactDOM.createPortal(
        <div className={cl.modalOverlay} onClick={e => { setIsOpen(false) }}>
            <div className={cl.popupBar} onClick={(e) => e.stopPropagation()}>
                <FiltersStickyBar />
            </div>
        </div>,
        document.getElementById("modal-root") // Рендеримо в портал
    );
};

export default PopupFilterBar;
