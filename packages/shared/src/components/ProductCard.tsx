// import React from 'react';
// import {api} from '../routes/api'
// import { Link } from 'react-router-dom';
// import cl from '../utils/styles/ProductCard.module.scss'

// import ButtonImage from './UI/ButtonImage/ButtonImage'
// import shoppingCardImage from '@packages/shared/src/assets/images/icons/shoppingCardImage.png'
// import DescriptionPrice from './../../../../services/shop/src/components/UI/DescriptionPrice/DescriptionPrice'

// import { exportProductData } from './../../../../services/shop/src/state/targetProductData'
// import DisplayDiscount from './UI/DisplayDiscount/DisplayDiscount';

// interface ProductI {
//     name: string;
//     price: number;
//     discount: number;
//     image: string;
//     prevLocation?: string;
// }

// const ProductCard: React.FC<ProductI> = ({ ...props }) => {

//     const parseImageUrl = (name: string) => {
//         let parsedName: string = name.split(' ').join('-');
//         let locationPath: string = window.location.pathname;
//         console.log(`Минулий: ${props.prevLocation} Новий: ${locationPath}`)
//         if (
//             locationPath.split('/').includes('product') && 
//             props.prevLocation.split('/').includes('product')
//         ) {
//             console.log('cghfw.dfkj');
//             return `/fashion/shop/product/${parsedName}`;
//         }
//         return 'product' + '/' + parsedName;
//     };

//     const handleCartClick = (e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         exportProductData({
//             image: props.image,
//             discount: props.discount,
//             price: props.price,
//             name: props.name
//         });
//     }

//     return (
//         <article className={cl.product__card}>
//             <Link to={parseImageUrl(props.name)}>
//                 <div className={cl.product__img}>
//                     <img src={`${props.image}`} alt={`undefined image`} />
//                     <DisplayDiscount discount={props.discount}/>
//                 </div>
//                 <div className={cl.product__description}>
//                     <div className={cl.description__main}>
//                         <DescriptionPrice discountT={props.discount} priceT={props.price} />
//                         <ButtonImage
//                             img={shoppingCardImage}
//                             onClick={handleCartClick}
//                         />
//                     </div>
//                     <div className={cl.description__details}>
//                         <p>{props.name}</p>
//                     </div>
//                 </div>
//             </Link>
//         </article>
//     );
// };

// export default ProductCard;

//     // const parseImageUrl = (name: string) => {
//     //     const parsedName = name.split(' ').join('-');
//     //     return `product/${parsedName}`;
//     // };


// ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import cl from '../utils/styles/ProductCard.module.scss';
import ButtonImage from './UI/ButtonImage/ButtonImage';
import shoppingCardImage from '@packages/shared/src/assets/images/icons/shoppingCardImage.png';
import DescriptionPrice from '../../../../services/shop/src/components/UI/DescriptionPrice/DescriptionPrice';
import DisplayDiscount from './UI/DisplayDiscount/DisplayDiscount';
import { addToCart } from '../../../../services/shop/src/state/basketState';

interface ProductCardProps {
    name: string;
    price: number;
    discount: number;
    image: string;
    id?: number;
    category?: string;
    type?: string;
    color?: string;
    prevLocation?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ ...props }) => {
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
        
        // Додаємо продукт до кошика
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
            <Link to={parseImageUrl(props.name)}>
                <div className={cl.product__img}>
                    <img src={props.image} alt={`${props.name}`} />
                    <DisplayDiscount discount={props.discount}/>
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