import React, { useEffect, useState } from 'react';
import ReactDOM from "react-dom";
import cl from '../utils/styles/modules/PopupEditProduct.module.scss'

import type { ProductAttrType, ProductType } from '@packages/shared/src/utils/types/prosuctData.type'

import FileUploader from '@packages/shared/src/components/UI/FileUploader/FileUploader'
import InputData from '@packages/shared/src/components/UI/InputData/InputData'
import InputOption from '@packages/shared/src/components/UI/InputOption/InputOption'
import SubmitButton from '@packages/shared/src/components/UI/SubmitButton/SubmitButton';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';

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
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);

    const [productData, setProductData] = useState<ProductType>(initialData);
    const [productImage, setProductImage] = useState<File | null>(null);

    function handleProdDataChange(field: keyof ProductType, value: string | number | File, attr?: keyof ProductAttrType) {
        if (field === 'attributes') {
            setProductData((prev) => ({
                ...prev,
                attributes: {
                    ...prev.attributes,
                    [attr!]: value
                }
            }));
        } else if (field === 'image') {
            setProductImage(value as File);
        } else {
            setProductData((prev) => ({
                ...prev,
                [field]: value
            }));
        }
        console.log('productData:', productData);
        console.log('productImage:', productImage);
    }

    const { response, error, isLoading, fetchData } = useFetch<ProductType>();

    const onHandleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();

        Object.entries(productData).forEach(([key, value]) => {
            if (key === 'attributes' && typeof value === 'object' && value !== null) {
                formData.append('attributes', JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });
        // if (isEditMode && productData.id) { formData.append('id', productData.id.toString()); }

        if (productImage) {
            formData.append('image', productImage);
        }

        formData.append('event', props.type);

        console.log('Sending FormData:');
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch(`http://localhost:4005/fashion/admin/products/${isEditMode ? 'edit' : 'add'}`, {
                method: 'POST',
                body: formData,
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers.get('content-type'));

            const text = await response.text();

            let result;
            if (text) {
                try {
                    result = JSON.parse(text);
                } catch (parseError) {
                    console.log('Response is not JSON:', text);
                    result = { success: response.ok };
                }
            } else {
                console.log('Empty response');
                result = { success: response.ok };
            }

            console.log('Parsed result:', result);

            if (result.success || response.ok) {
                document.location.reload();
            }
        } catch (error) {
            console.error('Error uploading:', error);
        }
    };

    useEffect(() => {
        if (response?.success || response?.ok) {
            document.location.reload();
        }
    }, [response]);

    function handleImageChange(file: File | null) {
        if (file) {
            setProductImage(file);
            console.log('Selected file:', file);
        }
    }

    return ReactDOM.createPortal(
        <div className={cl.overlay}>
            <div className={cl.popup} ref={props.popupRef}>
                <form
                    onSubmit={(e: React.FormEvent) => onHandleSubmit(e)}
                    className={cl.content}>
                    <div className={cl.head}>
                        <section className={cl.section}>
                            <h3>Зображення товару</h3>
                            <div className={cl.gridSingle}>
                                <FileUploader
                                    data={{ image: isEditMode ? (props as PopType).data.image : undefined }}
                                    size={{ width: 250, height: 300 }}
                                    inputType='image'
                                    onChange={handleImageChange}
                                    required={!isEditMode}
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
                                    required={!isEditMode}
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
                                    required={!isEditMode}
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
                                    type='text'
                                    label='ID товару'
                                    {...(isEditMode && { value: productData.id })}
                                    disabled
                                    required={false}
                                />
                            }

                            <InputData
                                id='prod-name'
                                placeholder='Назва товару'
                                type='text'
                                label='Назва товару'
                                {...(isEditMode && { value: productData.name })}
                                onInput={(val) => handleProdDataChange('name', val)}
                                required={!isEditMode}
                            />
                            {isEditMode && <InputData
                                id='prod-brand'
                                placeholder='Бренд'
                                type='text'
                                label='Бренд'
                                {...(isEditMode && { value: productData.brand })}
                                onInput={(val) => handleProdDataChange('brand', val)}
                                required={!isEditMode}
                            />}

                        </div>
                        <div>
                            <InputData
                                id='prod-description'
                                placeholder='Опис...'
                                type='textarea'
                                label='Опис товару'
                                {...(isEditMode && { value: productData.description })}
                                onInput={(val) => handleProdDataChange('description', val)}
                                required={!isEditMode}
                            />
                        </div>
                    </section>

                    <section className={cl.section}>
                        <h3>Атрибути товару</h3>
                        <div className={cl.gridTwoCols}>
                            {/* <InputData
                                id='prod-type'
                                placeholder='Тип товару'
                                type='text'
                                label='Тип'
                                {...(isEditMode && { value: productData.attributes?.type })}
                                onInput={(val) => handleProdDataChange('attributes', val, 'type')}
                                required
                            /> */}
                            <InputOption
                                label='Тип'
                                optionBasic='hoodie'
                                {...(isEditMode && { value: productData.attributes?.type })}
                                options={['hoodie', "sweatshirt", "shirt", "tshirt"]}
                                onChange={(val) => handleProdDataChange('attributes', val, 'type')}
                                required={!isEditMode}
                            />
                            <InputOption
                                label='Категорія'
                                optionBasic='Чоловіче'
                                {...(isEditMode && { value: productData.attributes?.category })}
                                options={['male', "female"]}
                                onChange={(val) => handleProdDataChange('attributes', val, 'category')}
                                required={!isEditMode}
                            />
                            {/* <InputData
                                id='prod-color'
                                placeholder='Колір'
                                type='text'
                                label='Колір'
                                {...(isEditMode && { value: productData.attributes?.color })}
                                onInput={(val) => handleProdDataChange('attributes', val, 'color')}
                                required
                            /> */}
                            <InputOption
                                label='Колір'
                                optionBasic='black'
                                {...(isEditMode && { value: productData.attributes?.color })}
                                options={['black', "white", "yellow", "pink", "brown", "blue"]}
                                onChange={(val) => handleProdDataChange('attributes', val, 'color')}
                                required={!isEditMode}
                            />
                            <InputOption
                                label='Розмір'
                                optionBasic='M'
                                {...(isEditMode && { value: productData.attributes?.size })}
                                options={['S', "M", 'L', 'XL', 'XXL']}
                                onChange={(val) => handleProdDataChange('attributes', val, 'size')}
                                required={!isEditMode}
                            />
                        </div>
                    </section>
                    <section className={cl.submit}>
                        <SubmitButton
                            text={!isLoading ? 'Підтвердити' : (isLoading ? "Обробка..." : (response?.success ? 'Успішно!' : "Помилка"))}
                        />
                    </section>

                </form>
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
};

export default PopupEditProduct;