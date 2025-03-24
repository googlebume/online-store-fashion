import React from 'react';
import cl from './ButtonOrder.module.scss'

type InputTipe ={
    text: string;
    onClick?: ()=>void;
}

const ButtonOrder = ({text}: InputTipe) => {
    return (
        <div className={cl.order}>
            <button className={cl.orderButton}>{text}</button>
        </div>
    );
};

export default ButtonOrder;