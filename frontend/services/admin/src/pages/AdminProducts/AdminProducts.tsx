import React, { useEffect, useState, createContext, useContext, Dispatch, SetStateAction, useRef } from 'react';
import type { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '@packages/shared/src/components/ProductCard';
import PopupEditProduct from '../../components/PopupEditProduct';

import cl from './AdminProducts.module.scss';
import { backendOriginForPort } from '@packages/shared/src/config/backendOrigin';
import SearchInput from '@packages/shared/src/components/UI/form-controls/SearchInput/SearchInput';
import Button from '@packages/shared/src/components/UI/Button/Button';
import PlusIcon from '@packages/shared/src/assets/images/icons/plusIcon.svg';

import Cookies from '@packages/shared/src/utils/cookies';
import { setProducts } from '@packages/shared/src/store';
import type { RootState } from '@packages/shared/src/store';

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
    const dispatch = useDispatch();
    const { response, error, isLoading, fetchData } = useFetch<null, ProductType[]>();
    const filteredProducts = useSelector((state: RootState) => state.filteredProducts.filteredProducts);
    const filtersActive = useSelector((state: RootState) => state.filteredProducts.filtersActive);
    const [lastOfPath, setLastOfPath] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
    const [deletedProduct, setDeletedProduct] = useState<ProductType | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

    const cookies = new Cookies;

    useEffect(() => {
        const path = location.pathname.split('/')[3];
        setLastOfPath(path);
    }, [location.pathname]);

    const loadProducts = () => {
        if (lastOfPath && lastOfPath !== 'users') {
            fetchData({
                method: 'GET',
                url: `admin/${lastOfPath}`,
                port: 5004,
            });
            console.log(`to admin/${lastOfPath}`);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [lastOfPath]);

    useEffect(() => {
        if (Array.isArray(response)) {
            dispatch(setProducts(response));
        }
    }, [response, dispatch]);

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
        fetch(`${backendOriginForPort(5004)}/fashion/admin/products/delete/${deletedProduct.id}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${cookies.getCookie('token')}`
                },
            }
        )
            .then(response => response.json())
            .then(data => {
                console.log('Delete response:', data);
                if (data?.success === true) {
                    setDeletedProduct(null);
                    loadProducts();
                }
            })
    }, [deletedProduct]);

    return (
        <>
            {response && (
                <div className={cl.searcherAdmin}>
                    <div className={cl.searcherAdmin_search}>
                        <SearchInput allData={response} field="name" setReturnFiltered={setReturnFiltered} />
                    </div>
                    <Button
                        className={cl.addProductBtn}
                        text='Додати новий'
                        img={PlusIcon}
                        onClick={() => setIsPopupOpen(!isPopupOpen)}
                    />
                    {isPopupOpen && <PopupEditProduct
                        type='add'
                        popupRef={popupRef}
                        onSaved={loadProducts}
                        onClose={() => setIsPopupOpen(false)}
                    />}
                </div>

            )}
            <div className={cl.overview__prod}>
                <ProdContext.Provider value={{ setSelectedProduct, selectedProduct, setDeletedProduct, deletedProduct }}>

                    {(() => {
                        const baseList = filtersActive ? filteredProducts : (Array.isArray(response) ? response : []);
                        const displayList = Array.isArray(returnFiltered) && returnFiltered.length > 0
                            ? returnFiltered.filter((p) => !filtersActive || filteredProducts.some((fp) => fp.id === p.id))
                            : baseList;
                        return displayList.map((prod, index) => (
                            <ProductCard key={prod.id || index} data={prod as ProductType} />
                        ));
                    })()}

                    {selectedProduct !== null && (
                        <PopupEditProduct
                            data={selectedProduct}
                            popupRef={menuRef}
                            type="edit"
                            onSaved={loadProducts}
                            onClose={() => setSelectedProduct(null)}
                        />
                    )}
                </ProdContext.Provider>
            </div>
        </>

    );
};

export default AdminProducts;



