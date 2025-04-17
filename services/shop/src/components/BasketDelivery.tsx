// import React from 'react';
// import InputData from '@packages/shared/src/components/UI/InputData/InputData';

// const BasketDelivery = () => {
//     return (
//         <div className="cl.order-form">
//             <h2 style={{fontSize: '16px', fontWeight: '500', display: 'inline-block', marginBottom: '20px'}}>Оформлення замовлення</h2>
//             <form>
//                 <InputData type='text' id='1' placeholder='Іван Іванович' min={5} max={20} label="Ім'я замовника"/>
//                 <InputData type='tel' id='2' placeholder='+380 ХХХ ХХХХ' max={15} label="Номер телефону"/>
//                 <InputData type='text' id='3' placeholder='Вулиця, відділення' min={10} max={40} label="Адреса доставки"/>
//             </form>
//         </div>
//     );
// };

// export default BasketDelivery;

import React, { useState, useEffect } from 'react';
import InputData from '@packages/shared/src/components/UI/InputData/InputData';
import InputOption from '@packages/shared/src/components/UI/InputOption/InputOption';
import cl from '@/utils/styles/BasketDelivery.module.scss';
// import axios from 'axios';

const BasketDelivery = () => {
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [cities, setCities] = useState<string[]>([]);
    const [warehouses, setWarehouses] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('');


    // useEffect(() => {
    //     fetch('/api/nova-poshta/cities')
    //         .then(res => res.json())
    //         .then(data => setCities(data));
    // }, []);

    // useEffect(() => {
    //     if (selectedOption) {
    //         fetch(`/api/nova-poshta/warehouses?city=${selectedOption}`)
    //             .then(res => res.json())
    //             .then(data => setWarehouses(data));
    //     }
    // }, [selectedOption]);


    return (
        <div className={cl.orderForm}>
            <h2>Оформлення замовлення</h2>
            <form>
                <div className={cl.inputGroup}>
                    <InputData type='text' id='firstName' placeholder='Іван' label="Ім’я" />
                    <InputData type='text' id='lastName' placeholder='Іванов' label="Прізвище" />
                </div>

                <InputData type='tel' id='phone' placeholder='+380 ХХХ ХХХХ' label="Номер телефону" />
                <InputData type='email' id='email' placeholder='name@gmail.com' label="Email" />

                <InputOption
                    options={cities}
                    label='Місто доставки'
                    optionBasic='Оберіть місто'
                    value={selectedCity}
                    onChange={(val) => {
                        setSelectedCity(val);
                        setSelectedWarehouse('');
                    }}
                />

                <InputOption
                    options={warehouses}
                    label='Відділення'
                    optionBasic='Оберіть відділення'
                    value={selectedWarehouse}
                    onChange={setSelectedWarehouse}
                    disabled={!selectedCity}
                />

                <div className={cl.inputGroup}>
                    <InputOption
                        options={['Нова пошта', "Кур'єр", "Самовивіз"]}
                        label='Спосіб доставки'
                        optionBasic='Спосіб доставки'
                        value={selectedDeliveryMethod}
                        onChange={setSelectedDeliveryMethod}
                        disabled={!selectedWarehouse}
                    />
                    {!showCouponInput ? (
                        <button type="button" onClick={() => setShowCouponInput(true)} className={cl.couponButton}>
                            Ввести купон
                        </button>
                    ) : (
                        <div className={cl.couponField}>
                            <InputData type='text' id='coupon' placeholder='PROMO2024' label="Купон" />
                        </div>
                    )}
                </div>

            </form>
        </div>
    );
};

export default BasketDelivery;
