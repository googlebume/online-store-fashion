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
import { ProductType } from '../utils/types/prosuctData.type'
import { useProdContext } from '@admin/pages/AdminProducts/AdminProducts';

type ProductCardProp = {
    data: ProductType;
    prevLocation?: string;
};

const ProductCard: React.FC<ProductCardProp> = ({ data, prevLocation }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const location = useLocation();
    const menuRef = useRef<HTMLDivElement>(null);

    const { setSelectedProduct } = useProdContext();
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
            prevLocation?.split('/').includes('product')
        ) {
            return `/fashion/shop/product/${parsedName}`;
        }
        return 'product' + '/' + parsedName;
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        addToCart({
            id: data.id,
            image: data.image,
            discount: data.discount,
            price: data.price,
            name: data.name,
            category: data.attributes.category,
            type: data.attributes.type,
            color: data.attributes.color
        });
    };

    return (
        <article className={cl.product__card}>
            <Link to={location.pathname.includes('admin') ? null : parseImageUrl(data.name)}>
                <div className={cl.product__img}>
                    <img src={data.image} alt={`${data.name}`} />
                    <DisplayDiscount discount={data.discount} />
                </div>
                <div className={cl.product__description}>
                    <div className={cl.description__main}>
                        <DescriptionPrice discountT={data.discount} priceT={data.price} />
                        {
                            location.pathname === "/fashion/shop"
                                ? <ButtonImage
                                    img={<ShoppingCardIcon height='28px' width='28px' color={`${variables.yellow}`} fill={`${variables.yellow}`} />}
                                    onClick={handleCartClick}
                                />
                                : <ActionsMenu
                                    actionList={adminProductsAction(data, setSelectedProduct)}
                                    setIsOpen={setIsOpen}
                                    isOpen={isOpen}
                                    ref={menuRef}
                                    data={data}
                                />
                        }

                    </div>
                    <div className={cl.description__details}>
                        <p>{data.name}</p>
                    </div>
                </div>
            </Link>
        </article>
    );
};

export default ProductCard;