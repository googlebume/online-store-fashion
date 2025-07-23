import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import cl from '../utils/styles/modules/PopupEditProduct.module.scss'

import type { ProductAttrType, ProductType } from '@packages/shared/src/utils/types/prosuctData.type'

import FileUploader from '@packages/shared/src/components/UI/FileUploader/FileUploader'
import InputData from '@packages/shared/src/components/UI/InputData/InputData'
import InputOption from '@packages/shared/src/components/UI/InputOption/InputOption'

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

    const [productData, setProductData] = useState<ProductType>(props.data)

    function handleProdDataChange(field: keyof ProductType, value: string | number, attr?: keyof ProductAttrType) {
        if (field === 'attributes') {
            setProductData((prev) => ({
                ...prev,
                attributes: {
                    ...prev.attributes,
                    [attr]: value
                }
            }))
        } else {
            setProductData((prev) => ({
                ...prev,
                [field]: value
            }))
        }
        console.log(productData)
    }

    return ReactDOM.createPortal(
        <div className={cl.overlay}>
            <div className={cl.popup} ref={props.popupRef}>
                <div className={cl.content}>
                    <div className={cl.head}>
                        <section className={cl.section}>
                            <h3>Зображення товару</h3>
                            <div className={cl.gridSingle}>
                                <FileUploader
                                    data={{ image: props.data.image }}
                                    size={{ width: 250, height: 300 }}
                                    inputType='image'
                                />
                            </div>
                        </section>
                        <section className={cl.section}>
                            <h3>Ціноутворення</h3>
                            <div className={cl.gridTwoCols}>
                                <InputData
                                    id='prod-price'
                                    placeholder='Ціна у грн'
                                    type='number'
                                    label='Ціна товару'
                                    value={productData.price?.toString()}
                                    onInput={(val) => handleProdDataChange('price', val)}
                                />
                                <InputData
                                    id='prod-discount'
                                    placeholder='Знижка у відсотках'
                                    type='number'
                                    label='Знижка (%)'
                                    value={productData.discount?.toString()}
                                    min={0}
                                    max={100}
                                    onInput={(val) => handleProdDataChange('discount', val)}
                                />
                            </div>
                        </section>
                    </div>

                    <section className={cl.section}>
                        <h3>Основна інформація</h3>
                        <div className={cl.gridTwoCols}>
                            <InputData
                                id='prod-id'
                                placeholder='ID товару'
                                type='number'
                                label='ID товару'
                                value={productData.id?.toString()}
                                disabled
                            // onInput={(val) => handleProdDataChange('id', val)}
                            />
                            <InputData
                                id='prod-name'
                                placeholder='Назва товару'
                                type='text'
                                label='Назва товару'
                                value={productData.name}
                                onInput={(val) => handleProdDataChange('name', val)}
                            />
                            <InputData
                                id='prod-brand'
                                placeholder='Бренд'
                                type='text'
                                label='Бренд'
                                value={productData.brand}
                                onInput={(val) => handleProdDataChange('brand', val)}
                            />
                        </div>
                        <div>
                            <InputData
                                id='prod-description'
                                placeholder='Опис...'
                                type='textarea'
                                label='Опис товару'
                                value={productData.description}
                                onInput={(val) => handleProdDataChange('description', val)}
                            />
                        </div>
                    </section>

                    <section className={cl.section}>
                        <h3>Атрибути товару</h3>
                        <div className={cl.gridTwoCols}>
                            <InputData
                                id='prod-type'
                                placeholder='Тип товару'
                                type='text'
                                label='Тип'
                                value={productData.attributes?.type}
                                onInput={(val) => handleProdDataChange('attributes', val, 'type')}
                            />
                            <InputOption
                                label='Категорія'
                                optionBasic='Чоловіче'
                                value={productData.attributes?.category}
                                options={['Чоловіче', "Жіноче"]}
                                onChange={(val) => handleProdDataChange('attributes', val, 'category')}
                                //onInput={(val) => handleProdDataChange('attributes', val, 'type')}
                            />
                            <InputData
                                id='prod-color'
                                placeholder='Колір'
                                type='text'
                                label='Колір'
                                value={productData.attributes?.color}
                                onInput={(val) => handleProdDataChange('attributes', val, 'color')}
                            />
                            <InputOption
                                label='Розмір'
                                optionBasic='M'
                                value={productData.attributes?.size}
                                options={['S', "M", 'L', 'XL', 'XXL']}
                                onChange={(val) => handleProdDataChange('attributes', val, 'size')}
                            />
                        </div>
                    </section>
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default PopupEditProduct;