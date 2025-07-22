import React, { useEffect } from 'react';
import ReactDOM from "react-dom";
import cl from '../utils/styles/modules/PopupEditProduct.module.scss'

import type { ProductType } from '@packages/shared/src/utils/types/prosuctData.type'

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
                                    value={props.data.price?.toString()}
                                />
                                <InputData
                                    id='prod-discount'
                                    placeholder='Знижка у відсотках'
                                    type='number'
                                    label='Знижка (%)'
                                    value={props.data.discount?.toString()}
                                    min={0}
                                    max={100}
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
                                value={props.data.id?.toString()}
                            />
                            <InputData
                                id='prod-name'
                                placeholder='Назва товару'
                                type='text'
                                label='Назва товару'
                                value={props.data.name}
                            />
                            <InputData
                                id='prod-brand'
                                placeholder='Бренд'
                                type='text'
                                label='Бренд'
                                value={props.data.brand}
                            />
                        </div>
                        <div>
                            <InputData
                                id='prod-description'
                                placeholder='Опис...'
                                type='textarea'
                                label='Опис товару'
                                value={props.data.description}
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
                                value={props.data.attributes?.type}
                            />
                            <InputOption
                                label='Категорія'
                                optionBasic='Чоловіче'
                                value={props.data.attributes?.category}
                                options={['Чоловіче', "Жіноче"]}
                                onChange={e => console.log(props.data.attributes?.category)}
                            />
                            <InputData
                                id='prod-color'
                                placeholder='Колір'
                                type='text'
                                label='Колір'
                                value={props.data.attributes?.color}
                            />
                            <InputOption
                                label='Розмір'
                                optionBasic='M'
                                value={props.data.attributes?.size}
                                options={['S', "M", 'L', 'XL', 'XXL']}
                                onChange={e => console.log(props.data.attributes?.size)}
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