import React from 'react';
import {childrenInterface} from '@packages/shared/src/utils/interfaces/children.interface'
import cl from "./CountControl.module.scss";

const CountControl: React.FC<childrenInterface> = ({ children, onClick }) => {
    return (

        <button className={cl.counterBtn} onClick={onClick}>{children}</button>
    );
};

export default CountControl;