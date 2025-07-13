import React, { useEffect } from 'react';
import type { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { useLocation } from 'react-router-dom';
import { api } from '@packages/shared/src/routes/api';

import ProductCard from '@packages/shared/src/components/ProductCard';

import cl from './AdminProdUsers.module.scss';
import UserCard from '@/components/UserCard';

const AdminProdUsers = () => {
    const location = useLocation();


    const { response, error, isLoading, fetchData } = useFetch<null, ProductType[] | UserDataType[]>();


    useEffect(() => {
        fetchData({
            method: 'GET',
            url: `admin/${location.pathname.split('/')[3]}`,
            port: 4005,
        });
        console.log(`to   admin/${location.pathname.split('/')[3]}`)
    }, []);

    useEffect(() => {
        console.log(response)
    },[response])

    return (
        <div className={cl.overview}>
            {
                Array.isArray(response) && "email" in response[0]
                    ? <UserCard users={response as UserDataType[]} />
                    : null
            }
        </div>
    );
};

export default AdminProdUsers;