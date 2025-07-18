import React, { useEffect, useState } from 'react';
import type { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { useLocation } from 'react-router-dom';
import { api } from '@packages/shared/src/routes/api';

import ProductCard from '@packages/shared/src/components/ProductCard';

import cl from './AdminProdUsers.module.scss';
import UserCard from '@/components/UserCard';
import PopupEditProduct from '@/components/PopupEditProduct';

const AdminProdUsers = () => {
    const location = useLocation();


    const { response, error, isLoading, fetchData } = useFetch<null, ProductType[] | UserDataType[]>();
    const [lastOfPath, setLastOfPath] = useState('');
    useEffect(() => {
        const path = location.pathname.split('/')[3];
        setLastOfPath(path)
    }, [location.pathname]) 

    useEffect(() => {
        fetchData({
            method: 'GET',
            url: `admin/${lastOfPath}`,
            port: 4005,
        });
        console.log(`to   admin/${lastOfPath}`)
    }, [lastOfPath]);

    useEffect(() => {
        console.log(response)
    }, [response])

    return (
        <div className={`${lastOfPath === "users" ? cl.overview : cl.overview__prod}`}>
            {Array.isArray(response) && "email" in response[0] && <UserCard users={response as UserDataType[]} />}
            {Array.isArray(response) && "price" in response[0] && (response.map((prod, index) => (
                <ProductCard
                    key={index}
                    name={`${prod.name}`}
                    price={prod.price}
                    discount={prod.discount}
                    image={prod.image} />
            )
            ))}
            {/* {"price" in response[0] ? <PopupEditProduct data={{...response[0]}} type='edit'/> : null} */}
        </div>
    );
};

export default AdminProdUsers;