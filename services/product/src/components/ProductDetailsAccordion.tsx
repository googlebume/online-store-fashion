import React from 'react';
import cl from '@/utils/styles/ProductDetailsAccordion.module.scss';
import { ProductType } from '@packages/shared/src/utils/types/prosuctData.type';

type DetailsType = {
    product: ProductType;
};

const ProductDetailsAccordion: React.FC<DetailsType> = ({ product }) => {
    return (
        <div className={cl.detailsAccordion}>
            <div className={cl.accordionItem}>
                <div className={cl.accordionTitle}>
                    <span>Про товар</span>
                    <i className="fas fa-chevron-down"></i>
                </div>
                <div className={cl.accordionContent}>
                    <ul className={cl.detailsList}>
                        {product.attributes.map((attr, index) => (
                            <React.Fragment key={index}>
                                <li>
                                    <div className={cl.row}>
                                        <span className={cl.label}>Вага:</span>
                                        <div className={cl.dash}></div>
                                        <span className={cl.value}>{attr.weight || 'Невідомо'}</span>
                                    </div>
                                </li>
                                <li>
                                    <div className={cl.row}>
                                        <span className={cl.label}>Бренд:</span>
                                        <div className={cl.dash}></div>
                                        <span className={cl.value}>{attr.brand || 'Невідомо'}</span>
                                    </div>
                                </li>
                                <li>
                                    <div className={cl.row}>
                                        <span className={cl.label}>Матеріал:</span>
                                        <div className={cl.dash}></div>
                                        <span className={cl.value}>{attr.material || 'Невідомо'}</span>
                                    </div>
                                </li>
                                <li>
                                    <div className={cl.row}>
                                        <span className={cl.label}>Країна виробництва:</span>
                                        <div className={cl.dash}></div>
                                        <span className={cl.value}>{attr.countryOfOrigin || 'Невідомо'}</span>
                                    </div>
                                </li>
                            </React.Fragment>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsAccordion;
