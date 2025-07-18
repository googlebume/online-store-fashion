import React from 'react';
import cl from '@/utils/styles/modules/PopupEditProduct.scss'

import {ProductType} from '@packages/shared/src/utils/types/prosuctData.type'

type PopupEditProductType<T extends 'edit' | 'add'> =
    T extends 'edit'
        ? ProductType & {type: T}
        : {type: T}

const PopupEditProduct: React.FC<PopupEditProductType<'edit'>> = ({...props}) => {
    return (
        <div>
            <div className={cl.mainData}>
                
            </div>
        </div>
    );
};

export default PopupEditProduct;