import React from 'react';
import cl from './ClosePopupCross.module.scss'

const ClosePopupCross = ({setOpenStatus}) => {
    return (
        <div className={cl.cross__overlay} onClick={e => {setOpenStatus(false)}}>
            <span className={cl.cross__line}></span>
            <span className={cl.cross__line}></span>
        </div>
    );
};

export default ClosePopupCross;