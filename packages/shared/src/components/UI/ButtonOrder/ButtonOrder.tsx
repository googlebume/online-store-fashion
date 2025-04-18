import React from 'react';
import cl from './ButtonOrder.module.scss'

type InputTipe ={
    text: string;
    onClick?: ()=>void;
}

const ButtonOrder = ({text}: InputTipe) => {
    return (
        <button className={cl.orderButton}>{text}</button>
    );
};

export default ButtonOrder;