import React from 'react';
import cl from '@/utils/styles/ProductCard.module.scss'

const ProductCard = ({...props}) => {
    return (
        <article className={cl.product__card}>
            <div className={cl.product__img}>
                <img src="" alt="" />
            </div>
            <div className={cl.product__description}>
                <div className={cl.description__main}>
                    <div className={cl.description__price}>
                        <span className={cl.price__discount}>{props.discount}</span>
                        <span className={cl.price}>{props.price}</span>
                    </div>
                    <div className={cl.toBasket}></div>
                </div>
                <div className={cl.description__details}>
                    <p>{props.name}</p>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;