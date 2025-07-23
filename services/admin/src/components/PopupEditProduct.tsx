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
    : { type: T; popupRef: React.RefObject<HTMLDivElement> }

const PopupEditProduct = <T extends 'edit' | 'add'>({ ...props }: PopupEditProductType<T>) => {
    const isEditMode = props.type === 'edit';
    const initialData = isEditMode ? (props as PopType).data : {} as ProductType;

    useEffect(() => {
        document.body.style.overflow = isEditMode || !isEditMode ? 'hidden' : 'auto';
    }, [isEditMode]);

    const [productData, setProductData] = useState<ProductType>(initialData)

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
                                    data={{ image: isEditMode ? (props as PopType).data.image : undefined }}
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
                                    {...(isEditMode && { value: productData.price?.toString() })}
                                    onInput={(val) => handleProdDataChange('price', val)}
                                />
                                <InputData
                                    id='prod-discount'
                                    placeholder='Знижка у відсотках'
                                    type='number'
                                    label='Знижка (%)'
                                    {...(isEditMode && { value: productData.discount?.toString() })}
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
                            {props.type === 'add'
                                ? null
                                : <InputData
                                    id='prod-id'
                                    placeholder='ID товару'
                                    type='number'
                                    label='ID товару'
                                    {...(isEditMode && { value: productData.id?.toString() })}
                                    disabled
                                />
                            }

                            <InputData
                                id='prod-name'
                                placeholder='Назва товару'
                                type='text'
                                label='Назва товару'
                                {...(isEditMode && { value: productData.name })}
                                onInput={(val) => handleProdDataChange('name', val)}
                            />
                            <InputData
                                id='prod-brand'
                                placeholder='Бренд'
                                type='text'
                                label='Бренд'
                                {...(isEditMode && { value: productData.brand })}
                                onInput={(val) => handleProdDataChange('brand', val)}
                            />
                        </div>
                        <div>
                            <InputData
                                id='prod-description'
                                placeholder='Опис...'
                                type='textarea'
                                label='Опис товару'
                                {...(isEditMode && { value: productData.description })}
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
                                {...(isEditMode && { value: productData.attributes?.type })}
                                onInput={(val) => handleProdDataChange('attributes', val, 'type')}
                            />
                            <InputOption
                                label='Категорія'
                                optionBasic='Чоловіче'
                                {...(isEditMode && { value: productData.attributes?.category })}
                                options={['Чоловіче', "Жіноче"]}
                                onChange={(val) => handleProdDataChange('attributes', val, 'category')}
                            />
                            <InputData
                                id='prod-color'
                                placeholder='Колір'
                                type='text'
                                label='Колір'
                                {...(isEditMode && { value: productData.attributes?.color })}
                                onInput={(val) => handleProdDataChange('attributes', val, 'color')}
                            />
                            <InputOption
                                label='Розмір'
                                optionBasic='M'
                                {...(isEditMode && { value: productData.attributes?.size })}
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