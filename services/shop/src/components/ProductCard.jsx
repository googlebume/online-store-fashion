import React from 'react';
import cl from '@/utils/styles/ProductCard.module.scss'

import ButtonImage from '../../../../packages/shared/src/components/UI/ButtonImage/ButtonImage'
import shoppingCardImage from '@packages/shared/src/assets/images/icons/shoppingCardImage.png'


const ProductCard = ({...props}) => {
    const discount = (+props.discount * +props.price)/100;
    const price = Math.round(+props.price - discount);
    return (
        <article className={cl.product__card}>
            <div className={cl.product__img}>
                <img src={props.image} alt={`undefinded image`} />
            </div>
            <div className={cl.product__description}>
                <div className={cl.description__main}>
                    <div className={cl.description__price}>
                        <span className={cl.price__discount}>{price}</span>
                        <span className={cl.price}>{props.price}</span>
                    </div>
                    <ButtonImage img={shoppingCardImage}/>
                </div>
                <div className={cl.description__details}>
                    <p>{props.name}</p>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;