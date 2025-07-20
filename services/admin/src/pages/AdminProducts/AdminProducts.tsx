import React, { useEffect, useState, createContext, useContext, Dispatch, SetStateAction, useRef } from 'react';
import type { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { useLocation } from 'react-router-dom';
import ProductCard from '@packages/shared/src/components/ProductCard';
import PopupEditProduct from '../../components/PopupEditProduct';

import cl from './AdminProducts.module.scss';

export const ProdContext = createContext<{
    setSelectedProduct: Dispatch<SetStateAction<ProductType | null>>;
    selectedProduct: ProductType | null;
}>({
    setSelectedProduct: () => { },
    selectedProduct: null
});

export const useProdContext = () => {
    const context = useContext(ProdContext);
    if (!context) {
        throw new Error('useProdContext must be used within ProdContext.Provider');
    }
    return context;
};

const AdminProducts = () => {
    const location = useLocation();
    const { response, error, isLoading, fetchData } = useFetch<null, ProductType[]>();
    const [lastOfPath, setLastOfPath] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

    function isProduct(data: any): data is ProductType {
        return data && typeof data === 'object' && 'price' in data;
    }

    useEffect(() => {
        const path = location.pathname.split('/')[3];
        setLastOfPath(path);
    }, [location.pathname]);

    useEffect(() => {
        if (lastOfPath && lastOfPath !== 'users') {
            fetchData({
                method: 'GET',
                url: `admin/${lastOfPath}`,
                port: 4005,
            });
            console.log(`to admin/${lastOfPath}`);
        }
    }, [lastOfPath]);

    useEffect(() => {
        console.log(response);
    }, [response]);

    if (lastOfPath === 'users') {
        return null;
    }

    const menuRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);


    return (
        <div className={cl.overview__prod}>
            <ProdContext.Provider value={{ setSelectedProduct, selectedProduct }}>
                {response !== null && Array.isArray(response) && response.length > 0 && "price" in response[0] &&
                    response.map((prod, index) => (
                        <ProductCard
                            key={index}
                            data={prod as ProductType}
                        />
                    ))
                }

                {selectedProduct && (
                    <PopupEditProduct data={selectedProduct} isOpen={ isOpen } popupRef={menuRef} type='edit' />
                )}
            </ProdContext.Provider>
        </div>
    );
};

export default AdminProducts;