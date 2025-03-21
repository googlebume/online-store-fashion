import React from 'react';
import InputData from '@packages/shared/src/components/UI/InputData/InputData';

const BasketDelivery = () => {
    return (
        <div className="cl.order-form">
            <h2 style={{fontSize: '16px', fontWeight: '500', display: 'inline-block', marginBottom: '20px'}}>Оформлення замовлення</h2>
            <form>
                <InputData type='text' placeholder='Іван Іванович' min={5} max={20} label="Ім'я замовника"/>
                <InputData type='tel' placeholder='+380 ХХХ ХХХХ' max={15} label="Номер телефону"/>
                <InputData type='text' placeholder='Вулиця, відділення' min={10} max={40} label="Адреса доставки"/>

                <button type="submit" className="order-button">Оформити замовлення</button>
            </form>
        </div>
    );
};

export default BasketDelivery;