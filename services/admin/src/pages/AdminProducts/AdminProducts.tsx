import React, { useEffect, useState, createContext, useContext, Dispatch, SetStateAction, useRef } from 'react';
import type { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { useLocation } from 'react-router-dom';
import ProductCard from '@packages/shared/src/components/ProductCard';
import PopupEditProduct from '../../components/PopupEditProduct';

import cl from './AdminProducts.module.scss';
import SearchInput from '@packages/shared/src/components/UI/SearchInput/SearchInput';
import SubmitButton from '@packages/shared/src/components/UI/SubmitButton/SubmitButton';
import PlusIcon from '@packages/shared/src/assets/images/icons/plusIcon.svg';

export const ProdContext = createContext<{
    setSelectedProduct: Dispatch<SetStateAction<ProductType | null>>;
    setDeletedProduct?: Dispatch<SetStateAction<ProductType | null>>;
    selectedProduct: ProductType | null;
    deletedProduct?: ProductType | null;
}>({
    setSelectedProduct: () => { },
    setDeletedProduct: () => { },
    selectedProduct: null,
    deletedProduct: null,
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
    const [deletedProduct, setDeletedProduct] = useState<ProductType | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

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
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setSelectedProduct(null);
            }
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setIsPopupOpen(false);
            }
        };

        if (selectedProduct !== null || isPopupOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedProduct, isPopupOpen]);

    const [returnFiltered, setReturnFiltered] = useState<ProductType[]>([]);

    useEffect(() => {
        if (!deletedProduct) return;
        console.log('Deleted product:', deletedProduct);
        fetch(`http://localhost:4005/fashion/admin/products/delete/${deletedProduct.id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then(response => response.json())
            .then(data => {
                console.log('Delete response:', data);
                data?.success === true && document.location.reload()
            })
    }, [deletedProduct]);

    return (
        <>
            {response && (
                <div className={cl.searcherAdmin}>
                    <SearchInput allData={response} field="name" setReturnFiltered={setReturnFiltered} />
                    <SubmitButton
                        text='Додати новий'
                        img={PlusIcon}
                        onClick={() => setIsPopupOpen(!isPopupOpen)}
                    />
                    {isPopupOpen && <PopupEditProduct
                        type='add'
                        popupRef={popupRef}
                    />}
                </div>

            )}
            <div className={cl.overview__prod}>
                <ProdContext.Provider value={{ setSelectedProduct, selectedProduct, setDeletedProduct, deletedProduct }}>
                    {Array.isArray(returnFiltered) && returnFiltered.length > 0 ? (
                        returnFiltered.map((prod, index) => (
                            <ProductCard key={index} data={prod as ProductType} />
                        ))
                    ) : Array.isArray(response) && response.length > 0 ? (
                        response.map((prod, index) => (
                            <ProductCard key={index} data={prod as ProductType} />
                        ))
                    ) : null}

                    {selectedProduct !== null && (
                        <PopupEditProduct data={selectedProduct} popupRef={menuRef} type="edit" />
                    )}
                </ProdContext.Provider>
            </div>
        </>

    );
};

export default AdminProducts;