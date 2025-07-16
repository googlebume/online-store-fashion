import ShoppingCardIcon from '@packages/shared/src/assets/images/icons/shoppingCardIcon.svg';
import variables from '@packages/shared/src/utils/styles/colorScheme';
import cl from '@packages/shared/src/utils/styles/modules/ProductCard.module.scss';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import DescriptionPrice from '../../../../services/shop/src/components/UI/DescriptionPrice/DescriptionPrice';
import { addToCart } from '../../../../services/shop/src/state/basketState';
import { adminProductsAction } from '../utils/constants/actionsMenu';
import ActionsMenu from './UI/ActionsMenu/ActionsMenu';
import ButtonImage from './UI/ButtonImage/ButtonImage';
import DisplayDiscount from './UI/DisplayDiscount/DisplayDiscount';

interface ProductCardProps {
    name: string;
    price: number;
    discount?: number;
    image: string;
    id?: number;
    category?: string;
    type?: string;
    color?: string;
    prevLocation?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ ...props }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const location = useLocation();
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const parseImageUrl = (name: string) => {
        let parsedName: string = name.split(' ').join('-');
        let locationPath: string = window.location.pathname;

        if (
            locationPath.split('/').includes('product') &&
            props.prevLocation?.split('/').includes('product')
        ) {
            return `/fashion/shop/product/${parsedName}`;
        }
        return 'product' + '/' + parsedName;
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            id: props.id,
            image: props.image,
            discount: props.discount,
            price: props.price,
            name: props.name,
            category: props.category,
            type: props.type,
            color: props.color
        });
    };

    return (
        <article className={cl.product__card}>
            <Link to={location.pathname.includes('admin') ? null : parseImageUrl(props.name)}>
                <div className={cl.product__img}>
                    <img src={props.image} alt={`${props.name}`} />
                    <DisplayDiscount discount={props.discount} />
                </div>
                <div className={cl.product__description}>
                    <div className={cl.description__main}>
                        <DescriptionPrice discountT={props.discount} priceT={props.price} />
                        {
                            location.pathname === "/fashion/shop"
                                ? <ButtonImage
                                    img={<ShoppingCardIcon height='28px' width='28px' color={`${variables.yellow}`} fill={`${variables.yellow}`} />}
                                    onClick={handleCartClick}
                                />
                                : <ActionsMenu 
                                    actionList={adminProductsAction} 
                                    setIsOpen={setIsOpen} 
                                    isOpen={isOpen}
                                    ref={menuRef}
                                />
                        }

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