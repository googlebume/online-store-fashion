import React from 'react';
import ReactDOM from "react-dom";
import cl from '../utils/styles/modules/PopupEditProduct.module.scss'

import {ProductType} from '@packages/shared/src/utils/types/prosuctData.type'
type PopType = {data: ProductType}

type PopupEditProductType<T extends 'edit' | 'add'> =
    T extends 'edit'
        ? PopType & {type: T}
        : {type: T}

const PopupEditProduct: React.FC<PopupEditProductType<'edit'>> = ({...props}) => {
    return ReactDOM.createPortal(
        <div className={cl.overlay}>
            <div className={cl.popup}>
                <div className={cl.content}>
                    {JSON.stringify(props.data)}
                </div>
                
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default PopupEditProduct;