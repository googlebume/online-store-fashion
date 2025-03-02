import React from 'react';
import ReactDOM from "react-dom";
import FiltersStickyBar from './FiltersStickyBar';

const PopupFilterBar = ({isOpen}) => {

    if (!isOpen) return null;
    return ReactDOM.createPortal (
        <div style={{
            // position: 'absolute',
            // top: '50%',
            // left: '50%',
            // transform: 'translate(-50%, -50%)'
        }}>
            <FiltersStickyBar />
            
        </div>,
        document.getElementById("modal-root") // Рендеримо в спеціальний контейнер поза #root
    );
};

export default PopupFilterBar;