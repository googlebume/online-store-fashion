import React, { useState, useEffect } from 'react';
import InputData from '@packages/shared/src/components/UI/InputData/InputData';
import InputOption from '@packages/shared/src/components/UI/InputOption/InputOption';
import cl from '@/utils/styles/BasketDelivery.module.scss';
import { getCartItems } from '@/state/basketState';

const BasketDelivery = () => {
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [cities, setCities] = useState<string[]>([]);
    const [warehouses, setWarehouses] = useState<string[]>([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('');
    const [prodInBasket, setProdInBasket] = useState(getCartItems());
    const [hasProducts, setHasProducts] = useState(false);

    useEffect(() => {
        const empty = prodInBasket.length > 0;
        setHasProducts(empty);
        const exportedProd = getCartItems();
        setProdInBasket(exportedProd)
    }, [prodInBasket, prodInBasket]);

    if (!hasProducts) return null;

    return (
        <div className={cl.orderForm}>
            <h2>Оформлення замовлення</h2>
            <form className={cl.form}>
                <section className={cl.section}>
                    <div className={cl.gridTwoCols}>
                        <InputData type='text' id='firstName' placeholder='Іван' label="Ім’я" />
                        <InputData type='text' id='lastName' placeholder='Іванов' label="Прізвище" />
                        <InputData type='tel' id='phone' placeholder='+380 ХХХ ХХХХ' label="Номер телефону" />
                        <InputData type='email' id='email' placeholder='name@gmail.com' label="Email" />
                    </div>
                </section>

                <section className={cl.section}>
                    <div className={cl.gridTwoCols}>
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
                    </div>
                </section>

                <section className={cl.section}>
                    <div className={cl.gridSingle}>
                        <InputOption
                            options={['Нова пошта', "Кур'єр", "Самовивіз"]}
                            label='Спосіб доставки'
                            optionBasic='Спосіб доставки'
                            value={selectedDeliveryMethod}
                            onChange={setSelectedDeliveryMethod}
                            disabled={!selectedWarehouse}
                        />
                    </div>
                    {!showCouponInput ? (
                        <button
                            type="button"
                            onClick={() => setShowCouponInput(true)}
                            className={cl.couponButton}
                        >
                            Ввести купон
                        </button>
                    ) : (
                        <div className={cl.gridSingle}>
                            <InputData type='text' id='coupon' placeholder='PROMO2024' label="Купон" />
                        </div>
                    )}
                </section>
            </form>
        </div>
    );
};

export default BasketDelivery;