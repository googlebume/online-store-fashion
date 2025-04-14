import React from 'react';
import { Link } from 'react-router-dom';
import cl from '../utils/styles/ProductCard.module.scss'

import ButtonImage from './UI/ButtonImage/ButtonImage'
import shoppingCardImage from '@packages/shared/src/assets/images/icons/shoppingCardImage.png'
import DescriptionPrice from './../../../../services/shop/src/components/UI/DescriptionPrice/DescriptionPrice'

import { exportProductData } from './../../../../services/shop/src/state/targetProductData'

interface ProductI {
    name: string;
    price: number;
    discount: number;
    image: string;
}

const ProductCard: React.FC<ProductI> = ({ ...props }) => {

    const parseImageUrl = (name: string) => {
        let parsedName: string = name.split(' ').join('-')
        return 'product' + '/' + parsedName;
    }

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        exportProductData({
            image: props.image,
            discount: props.discount,
            price: props.price,
            name: props.name
        });
    }

    return (
        <article className={cl.product__card}>
            <Link to={parseImageUrl(props.name)}>
                <div className={cl.product__img}>
                    <img src={`${props.image}`} alt={`undefined image`} />
                </div>
                <div className={cl.product__description}>
                    <div className={cl.description__main}>
                        <DescriptionPrice discountT={props.discount} priceT={props.price} />
                        <ButtonImage
                            img={shoppingCardImage}
                            onClick={handleCartClick}
                        />
                    </div>
                    <div className={cl.description__details}>
                        <p>{props.name}</p>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default ProductCard;