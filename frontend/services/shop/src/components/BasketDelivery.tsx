import React, { useState, useEffect, useRef } from 'react';
import InputData from '@packages/shared/src/components/UI/form-controls/InputData/InputData';
import InputOption from '@packages/shared/src/components/UI/form-controls/InputOption/InputOption';
import Button from '@packages/shared/src/components/UI/Button/Button';
import cl from '@shop/utils/styles/modules/BasketDelivery.module.scss';
import { getCartItems, getTotalPrice, subscribeToCartChanges } from '@shop/state/basketState';
import { trackAnalytics } from '@packages/shared/src/utils/analytics/trackAnalytics';
import { ECOMMERCE_CURRENCY } from '@packages/shared/src/utils/analytics/ecommercePayload';
import novaPoshtaService from '../utils/api/novaPoshta.api';
import type { PromoBasketEvent } from '@shop/types/promoBasket.events';
import { validatePromoCode } from '@shop/utils/api/orderPromo.api';

type BasketDeliveryProps = {
    setDeliveryParams: React.Dispatch<React.SetStateAction<Object>>;
    onPromoEvent: (ev: PromoBasketEvent) => void;
    activePromoCode: string | null;
    promoFieldError: string | null;
    promoValidating: boolean;
    couponDraft: string;
    setCouponDraft: React.Dispatch<React.SetStateAction<string>>;
    couponSectionOpen: boolean;
    setCouponSectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const BasketDelivery: React.FC<BasketDeliveryProps> = ({
    setDeliveryParams,
    onPromoEvent,
    activePromoCode,
    promoFieldError,
    promoValidating,
    couponDraft,
    setCouponDraft,
    couponSectionOpen,
    setCouponSectionOpen,
}) => {

    const [areas, setAreas] = useState<{ ref: string, name: string }[]>([]);
    const [cities, setCities] = useState<{ ref: string, name: string }[]>([]);
    const [warehouses, setWarehouses] = useState<{ ref: string, name: string }[]>([]);

    const [selectedArea, setSelectedArea] = useState('');
    const [selectedAreaRef, setSelectedAreaRef] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedCityRef, setSelectedCityRef] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedWarehouseRef, setSelectedWarehouseRef] = useState('');

    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState('');
    const [hasProducts, setHasProducts] = useState(getCartItems().length > 0);
    const [isLoading, setIsLoading] = useState(false);

    const email = useRef<string>('');

    const runCouponValidate = async () => {
        const raw = couponDraft.trim();
        if (!raw) {
            onPromoEvent({ type: 'clear' });
            return;
        }
        onPromoEvent({ type: 'validating' });
        try {
            const pricing = await validatePromoCode(raw);
            onPromoEvent({
                type: 'valid',
                code: pricing.promoCode ?? raw.toUpperCase(),
                pricing,
            });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Не вдалося застосувати промокод';
            onPromoEvent({ type: 'invalid', message });
        }
    };

    useEffect(() => {
        const loadAreas = async () => {
            setIsLoading(true);
            try {
                const areasData = await novaPoshtaService.getAreaNames();
                setAreas(areasData);
            } catch (error) {
                console.error('Помилка при завантаженні областей:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadAreas();
    }, []);

    useEffect(() => {
        if (!selectedAreaRef) {
            setCities([]);
            setSelectedCity('');
            setSelectedCityRef('');
            return;
        }

        const loadCities = async () => {
            setIsLoading(true);
            try {
                const citiesData = await novaPoshtaService.getCityNames(selectedAreaRef);
                setCities(citiesData);
            } catch (error) {
                console.error('Помилка при завантаженні міст:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadCities();
    }, [selectedAreaRef]);

    useEffect(() => {
        if (!selectedCityRef) {
            setWarehouses([]);
            setSelectedWarehouse('');
            setSelectedWarehouseRef('');
            return;
        }

        const loadWarehouses = async () => {
            setIsLoading(true);
            try {
                const warehousesData = await novaPoshtaService.getWarehouseNames(selectedCityRef);
                setWarehouses(warehousesData);
            } catch (error) {
                console.error('Помилка при завантаженні відділень:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadWarehouses();
    }, [selectedCityRef]);

    useEffect(() => {
        const syncHasProducts = () => {
            setHasProducts(getCartItems().length > 0);
        };

        syncHasProducts();
        const unsubscribe = subscribeToCartChanges(syncHasProducts);

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!selectedDeliveryMethod || !selectedWarehouse) {
            return;
        }
        trackAnalytics({
            name: 'add_shipping_info',
            payload: {
                currency: ECOMMERCE_CURRENCY,
                value: getTotalPrice(),
                shipping_tier: selectedDeliveryMethod,
            },
        });
    }, [selectedDeliveryMethod, selectedWarehouse]);

    const handleAreaChange = (areaName: string) => {
        const selectedAreaData = areas.find(area => area.name === areaName);
        setSelectedArea(areaName);
        setSelectedAreaRef(selectedAreaData?.ref || '');

        setSelectedCity('');
        setSelectedCityRef('');
        setSelectedWarehouse('');
        setSelectedWarehouseRef('');
    };

    const handleCityChange = (cityName: string) => {
        const selectedCityData = cities.find(city => city.name === cityName);
        setSelectedCity(cityName);
        setSelectedCityRef(selectedCityData?.ref || '');

        setSelectedWarehouse('');
        setSelectedWarehouseRef('');
    };

    const handleWarehouseChange = (warehouseName: string) => {
        const selectedWarehouseData = warehouses.find(warehouse => warehouse.name === warehouseName);
        setSelectedWarehouse(warehouseName);
        setSelectedWarehouseRef(selectedWarehouseData?.ref || '');
    };

    useEffect(() => {
        setDeliveryParams(prev => ({
            ...prev,
            deliveryMethod: selectedDeliveryMethod,
            address: `${selectedArea}, ${selectedCity}, ${selectedWarehouse}`,
            email: email.current
        }));
    }, [selectedArea, selectedCity, selectedWarehouse, selectedDeliveryMethod]);

    if (!hasProducts) return null;

    return (
        <div className={cl.orderForm}>
            <h2>Оформлення замовлення</h2>
            {isLoading && <div className={cl.loader}>Завантаження даних...</div>}
            <form className={cl.form}>
                <section className={cl.section}>
                    <div className={cl.gridTwoCols}>
                        <InputData type='text' id='firstName' placeholder='Іван' label="Ім'я" />
                        <InputData type='text' id='lastName' placeholder='Іванов' label='Прізвище' />
                        <InputData type='email' id='email' placeholder='name@gmail.com' label='Email' onInput={(val) => { email.current = val; }} />
                    </div>
                </section>

                <section className={cl.section}>
                    <div className={cl.gridTwoCols}>
                        <InputOption
                            options={areas.map(area => area.name)}
                            label='Область'
                            optionBasic='Оберіть область'
                            value={selectedArea}
                            onChange={handleAreaChange}
                            disabled={isLoading}
                        />
                        <InputOption
                            options={cities.map(city => city.name)}
                            label='Місто доставки'
                            optionBasic='Оберіть місто'
                            value={selectedCity}
                            disabled={!selectedArea || isLoading}
                            onChange={handleCityChange}
                        />
                        <InputOption
                            options={warehouses.map(warehouse => warehouse.name)}
                            label='Відділення'
                            optionBasic='Оберіть відділення'
                            value={selectedWarehouse}
                            onChange={handleWarehouseChange}
                            disabled={!selectedCity || isLoading}
                        />
                    </div>
                </section>

                <section className={cl.section}>
                    <div className={cl.gridSingle}>
                        <InputOption
                            options={['Нова пошта', "Кур'єр", 'Самовивіз']}
                            label='Спосіб доставки'
                            optionBasic='Спосіб доставки'
                            value={selectedDeliveryMethod}
                            onChange={setSelectedDeliveryMethod}
                            disabled={!selectedWarehouse || isLoading}
                        />
                    </div>
                    {!couponSectionOpen ? (
                        <Button
                            variant='coupon'
                            type='button'
                            onClick={() => setCouponSectionOpen(true)}
                        >
                            Ввести купон
                        </Button>
                    ) : (
                        <div className={cl.gridSingle}>
                            <InputData
                                type='text'
                                id='coupon'
                                placeholder='PROMO2024'
                                label='Промокод'
                                value={couponDraft}
                                disabled={promoValidating}
                                onInput={(val) => {
                                    const s = String(val);
                                    setCouponDraft(s);
                                    if (!s.trim()) {
                                        onPromoEvent({ type: 'clear' });
                                    } else if (promoFieldError) {
                                        onPromoEvent({ type: 'clear_field_error' });
                                    }
                                }}
                                onBlur={() => void runCouponValidate()}
                            />
                            {promoFieldError && (
                                <p className={cl.promoHintError} role="alert">
                                    {promoFieldError}
                                </p>
                            )}
                            {activePromoCode && !promoFieldError && !promoValidating && (
                                <p className={cl.promoHintOk}>Промокод застосовано</p>
                            )}
                        </div>
                    )}
                </section>
            </form>
        </div>
    );
};

export default BasketDelivery;




