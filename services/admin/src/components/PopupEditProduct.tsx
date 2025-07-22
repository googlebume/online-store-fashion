import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
import cl from '../utils/styles/modules/PopupEditProduct.module.scss'

import type { ProductType } from '@packages/shared/src/utils/types/prosuctData.type'

import FileUploader from '@packages/shared/src/components/UI/FileUploader/FileUploader'

type PopType = { 
    data: ProductType;
    popupRef: React.RefObject<HTMLDivElement>;
};

type PopupEditProductType<T extends 'edit' | 'add'> =
    T extends 'edit'
    ? PopType & { type: T }
    : { type: T }

const PopupEditProduct: React.FC<PopupEditProductType<'edit'>> = ({ ...props }) => {
    useEffect(() => {
        document.body.style.overflow = props.data ? 'hidden' : 'auto';
    }, [props.data]);

    return ReactDOM.createPortal(
        <div className={cl.overlay}>
            <div className={cl.popup} ref={props.popupRef}>
                <div className={cl.content}>
                    <FileUploader 
                        data={{ image: props.data.image }}
                        size={{ width: 250, height: 300 }}
                        inputType='image'
                    />
                    {JSON.stringify(props.data)}
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
};


export default PopupEditProduct;