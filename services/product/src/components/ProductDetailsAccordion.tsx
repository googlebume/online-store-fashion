import React from 'react';
import cl from '@/utils/styles/ProductDetailsAccordion.module.scss'

const ProductDetailsAccordion = () => {
    return (
        <div className={cl.detailsAccordion}>
            <div className={cl.accordionItem}>
                <button className={cl.accordionButton}>
                    <span>Деталі товару</span>
                    <i className="fas fa-chevron-down"></i>
                </button>
                <div className={cl.accordionContent}>
                    <ul className={cl.detailsList}>
                        <li>Матеріал: 100% натуральна шкіра</li>
                        <li>Підкладка: 100% бавовна</li>
                        <li>Країна виробництва: Італія</li>
                        <li>Застібка: блискавка + ґудзики</li>
                        <li>Кишені: 2 зовнішні, 2 внутрішні</li>
                        <li>Вага: 1.2 кг</li>
                    </ul>
                </div>
            </div>
            <div className={cl.accordionItem}>
                <button className={cl.accordionButton}>
                    <span>Доставка та повернення</span>
                    <i className="fas fa-chevron-down"></i>
                </button>
                <div className={cl.accordionContent}>
                    <p>Безкоштовна доставка при замовленні від ₴2000.</p>
                    <p>Термін доставки: 1-3 робочих дні.</p>
                    <p>Можливість повернення протягом 14 днів після отримання.</p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsAccordion;